import { cache } from "react";

import { InfiniteScrollPage, useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import {
  getTilDatabaseItems,
  getTilItemContent,
  NotionTilItem,
  NotionTilItemWithContent,
} from "@/lib/notion";

export type TilPage = InfiniteScrollPage<NotionTilItem>;

export function useTilEntries() {
  return useInfiniteScroll<NotionTilItem>((index: number, previousPage: TilPage | null) => {
    if (previousPage && !previousPage.nextCursor) return null;
    if (index === 0) return `/api/til?limit=20`;
    return `/api/til?cursor=${previousPage?.nextCursor}&limit=20`;
  });
}

async function fetchAllTilEntries(): Promise<NotionTilItem[]> {
  let allEntries: NotionTilItem[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const { items, nextCursor } = await getTilDatabaseItems(cursor, 100);
    allEntries = [...allEntries, ...items];
    cursor = nextCursor || undefined;
    hasMore = !!nextCursor;
  }

  return allEntries;
}

export const getAllTilEntries = cache(fetchAllTilEntries);

export async function getTilEntriesWithContent(
  entries: NotionTilItem[],
): Promise<NotionTilItemWithContent[]> {
  const entriesWithContent = await Promise.all(
    entries.map(async (entry) => {
      const content = await getTilItemContent(entry.id);
      if (!content) {
        return {
          ...entry,
          blocks: [],
        };
      }
      return content;
    }),
  );

  return entriesWithContent;
}
