import { desc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "../client";
import { listeningHistory } from "../schema/listening";

export type ListeningHistoryItem = {
  id: string;
  name: string;
  artist: string;
  album: string;
  url?: string;
  playedAt: string;
  image?: string;
};

export async function getListeningHistoryItems(
  cursor?: string,
  pageSize: number = 20,
): Promise<{ items: ListeningHistoryItem[]; nextCursor: string | null }> {
  "use cache";
  cacheLife("minutes");
  cacheTag("listening");

  const offset = cursor ? parseInt(cursor, 10) : 0;

  const rows = await db
    .select()
    .from(listeningHistory)
    .orderBy(desc(listeningHistory.playedAt))
    .limit(pageSize)
    .offset(offset);

  const items: ListeningHistoryItem[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    artist: row.artist ?? "",
    album: row.album ?? "",
    url: row.spotifyUrl ?? undefined,
    playedAt: row.playedAt?.toISOString() ?? "",
    image: row.icon ?? undefined,
  }));

  const nextCursor = items.length === pageSize ? String(offset + pageSize) : null;

  return { items, nextCursor };
}
