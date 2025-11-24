/**
 * Sync recently-played Spotify tracks into the Notion "Music" DB.
 *
 * • Converts Spotify UTC timestamps → Pacific date (America/Los_Angeles)
 *   so late-night listens attach to the right journal entry.
 * • Deduplicates both per-run and against existing Notion rows.
 * • Obeys Notion rate limits (400 ms between writes).
 */

import { Client } from "@notionhq/client";

import { notion } from "@/lib/notion/client";

import { getSpotifyToken } from "./auth";

const TIMEZONE = "America/Los_Angeles";

/** Property names - override via env if your Notion schema differs. */
const MUSIC_JOURNAL_RELATION_PROP = "Journal";

const LOOKBACK_HOURS = 6; // how far back we look in the Spotify feed
export const RATE_LIMIT_MS = 400; // >=333 ms -> <=3 req/sec

// ---------- Types ---------- //

export type ISODateString = string;

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  popularity: number;
  explicit: boolean;
  external_urls: { spotify: string };
}

export interface RecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: ISODateString; // always UTC from Spotify
}

// ---------- Time helpers ---------- //

/** Return YYYY-MM-DD for the Pacific date that a UTC ISO string falls on. */
export function toPacificDateString(utcIso: ISODateString): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(utcIso));
}

/** Simple sleep helper. */
export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------- Notion helpers ---------- //

export async function notionTrackExists(
  notionClient: Client,
  trackId: string,
  playedAtIso: ISODateString,
): Promise<boolean> {
  const { results } = await notionClient.databases.query({
    database_id: process.env.NOTION_MUSIC_DATABASE_ID!,
    filter: {
      and: [
        { property: "Spotify ID", rich_text: { equals: trackId } },
        { property: "Played At", date: { equals: playedAtIso } },
      ],
    },
  });

  if (results.length) {
    console.log(`Already in Notion → ${trackId} @ ${playedAtIso}`);
  }
  return results.length > 0;
}

/**
 * Locate the Journal page for a given Pacific date.
 * Works whether the date column is a *Date* or a formula-string.
 */
export async function getJournalEntryIdForDate(
  notionClient: Client,
  pacificDate: string,
): Promise<string | null> {
  console.log(`Looking for journal entry with date: ${pacificDate}`);
  console.log(`Using database ID: ${process.env.JOURNAL_DATABASE_ID}`);

  try {
    // Query using the Date property instead of Formula Date
    const { results } = await notionClient.databases.query({
      database_id: process.env.JOURNAL_DATABASE_ID!,
      filter: {
        property: "Date",
        date: { equals: pacificDate },
      },
    });

    console.log(`Found ${results.length} results`);
    return results.length ? results[0].id : null;
  } catch (error) {
    console.error("Error querying Notion database:", error);
    throw error;
  }
}

export async function addTrackToNotion(
  notionClient: Client,
  item: RecentlyPlayedItem,
  journalEntryId: string | null,
): Promise<void> {
  const { track, played_at } = item;

  await notionClient.pages.create({
    parent: { database_id: process.env.NOTION_MUSIC_DATABASE_ID! },
    icon: track.album.images[0]
      ? { type: "external", external: { url: track.album.images[0].url } }
      : undefined,
    properties: {
      Name: { title: [{ text: { content: track.name } }] },
      Artist: { rich_text: [{ text: { content: track.artists[0].name } }] },
      Album: { rich_text: [{ text: { content: track.album.name } }] },
      "Played At": { date: { start: played_at } },
      Duration: { number: track.duration_ms },
      Popularity: { number: track.popularity },
      Explicit: { checkbox: track.explicit },
      "Spotify ID": { rich_text: [{ text: { content: track.id } }] },
      "Spotify URL": { url: track.external_urls.spotify },
      "Album Art": { url: track.album.images[0]?.url ?? "" },
      [MUSIC_JOURNAL_RELATION_PROP]: journalEntryId
        ? { relation: [{ id: journalEntryId }] }
        : undefined,
    },
  });
}

// ---------- Spotify helpers ---------- //

export async function fetchRecentSpotifyItems(limit: number): Promise<RecentlyPlayedItem[]> {
  const token = await getSpotifyToken();
  const res = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Spotify /recently-played → ${res.status} ${res.statusText}`);
  }

  const { items } = (await res.json()) as { items: RecentlyPlayedItem[] };
  return items;
}

/** Filter to last X hours AND de-duplicate (same trackId + played_at). */
export function recentUniqueItems(items: RecentlyPlayedItem[]): RecentlyPlayedItem[] {
  const cutoff = Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000;
  const map = new Map<string, RecentlyPlayedItem>();

  items.forEach((item) => {
    const key = `${item.track.id}-${item.played_at}`;
    if (new Date(item.played_at).getTime() >= cutoff && !map.has(key)) {
      map.set(key, item);
    }
  });

  return [...map.values()];
}

// ---------- Public entry-point ---------- //

export async function syncRecentTracks(limit = 10): Promise<void> {
  console.log("▶ Syncing Spotify → Notion");

  try {
    const items = recentUniqueItems(await fetchRecentSpotifyItems(limit));
    console.log(`Found ${items.length} recent item(s) after filtering.`);

    const processed = new Set<string>();
    let added = 0;
    let skipped = 0;

    for (const item of items) {
      const key = `${item.track.id}-${item.played_at}`;
      if (processed.has(key)) {
        skipped++;
        continue;
      }

      try {
        if (await notionTrackExists(notion, item.track.id, item.played_at)) {
          skipped++;
          continue;
        }

        const pacificDate = toPacificDateString(item.played_at);
        const journalId = await getJournalEntryIdForDate(notion, pacificDate);

        await delay(RATE_LIMIT_MS);
        await addTrackToNotion(notion, item, journalId);

        console.log(
          `✔ Added "${item.track.name}" (${pacificDate})${journalId ? " ↔ linked" : ""}`,
        );
        processed.add(key);
        added++;
      } catch (err) {
        console.error(`Error processing track ${item.track.name}:`, err);
        continue; // Skip this track and continue with the next one
      }
    }

    console.log(`Done. Added ${added} · Skipped ${skipped}`);
  } catch (err) {
    console.error("Error syncing recent tracks:", err);
    throw err; // Re-throw to let the caller handle it
  }
}
