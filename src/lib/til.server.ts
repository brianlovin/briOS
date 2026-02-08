import { cacheLife, cacheTag } from "next/cache";

import { getTilEntries as getTilEntriesFromDb, type TilEntry } from "@/db/queries/til";

export async function getAllTilEntries(): Promise<TilEntry[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("til");

  const all: TilEntry[] = [];
  let cursor: string | undefined;
  do {
    const { items, nextCursor } = await getTilEntriesFromDb(cursor, 100);
    all.push(...items);
    cursor = nextCursor ?? undefined;
  } while (cursor);
  return all;
}
