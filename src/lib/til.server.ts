import { cache } from "react";

import { getTilEntries as getTilEntriesFromDb, type TilEntry } from "@/db/queries/til";

async function fetchAllTilEntries(): Promise<TilEntry[]> {
  let allEntries: TilEntry[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const { items, nextCursor } = await getTilEntriesFromDb(cursor, 100);
    allEntries = [...allEntries, ...items];
    cursor = nextCursor || undefined;
    hasMore = !!nextCursor;
  }

  return allEntries;
}

export const getAllTilEntries = cache(fetchAllTilEntries);
