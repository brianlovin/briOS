import { notion } from "@/lib/notion/client";
import { getDataSourceId } from "@/lib/notion/queries";

const TIMEZONE = "America/Los_Angeles";
const LOOKBACK_HOURS = 6;

export const RATE_LIMIT_MS = 400;

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
  played_at: ISODateString;
}

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

export async function notionTrackExists(
  trackId: string,
  playedAtIso: ISODateString,
): Promise<boolean> {
  const dataSourceId = await getDataSourceId(process.env.NOTION_MUSIC_DATABASE_ID!);
  const { results } = await notion.dataSources.query({
    data_source_id: dataSourceId,
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

export async function addTrackToNotion(item: RecentlyPlayedItem): Promise<void> {
  const { track, played_at } = item;

  // brios's Notion client uses the v5 data-source API; a database_id parent is
  // still accepted at runtime (see notion/mutations.ts), but the SDK types
  // expect a data_source parent, so cast like the existing mutations do.
  const pageData = {
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
    },
  };

  await notion.pages.create(pageData as any);
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
