/**
 * Sync recently-played Spotify tracks into the Notion "Music" DB.
 *
 * • Deduplicates both per-run and against existing Notion rows.
 * • Obeys Notion rate limits (400 ms between writes).
 */

import { getSpotifyToken } from "./auth";
import {
  addTrackToNotion,
  delay,
  notionTrackExists,
  RATE_LIMIT_MS,
  type RecentlyPlayedItem,
  recentUniqueItems,
} from "./sync-utils";

// Re-export everything from sync-utils for existing consumers
export {
  addTrackToNotion,
  delay,
  type ISODateString,
  notionTrackExists,
  RATE_LIMIT_MS,
  type RecentlyPlayedItem,
  recentUniqueItems,
  type SpotifyTrack,
  toPacificDateString,
} from "./sync-utils";

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
        if (await notionTrackExists(item.track.id, item.played_at)) {
          skipped++;
          continue;
        }

        await delay(RATE_LIMIT_MS);
        await addTrackToNotion(item);

        console.log(`✔ Added "${item.track.name}"`);
        processed.add(key);
        added++;
      } catch (err) {
        console.error(`Error processing track ${item.track.name}:`, err);
        continue;
      }
    }

    console.log(`Done. Added ${added} · Skipped ${skipped}`);
  } catch (err) {
    console.error("Error syncing recent tracks:", err);
    throw err;
  }
}
