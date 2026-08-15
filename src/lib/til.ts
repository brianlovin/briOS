import { cache } from "react";

import { InfiniteScrollPage, useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import {
  getTilDatabaseItems,
  NotionTilItem,
  NotionTilItemWithContent,
  ProcessedBlock,
} from "@/lib/notion";

export type TilEntry = NotionTilItem & { blocks?: ProcessedBlock[] };

export type TilPage = InfiniteScrollPage<TilEntry>;

export function hydrateTilEntries(
  items: NotionTilItem[],
  contents: Array<Pick<NotionTilItemWithContent, "id" | "blocks"> | null>,
): TilEntry[] {
  const blocksById = new Map<string, ProcessedBlock[]>();
  for (const content of contents) {
    if (content) {
      blocksById.set(content.id, content.blocks);
    }
  }

  return items.map((item) => ({
    ...item,
    blocks: blocksById.get(item.id) ?? [],
  }));
}

export function useTilEntries(fallbackData?: TilPage[]) {
  return useInfiniteScroll<TilEntry>(
    (index: number, previousPage: TilPage | null) => {
      if (previousPage && !previousPage.nextCursor) return null;
      if (index === 0) return `/api/til?limit=20`;
      return `/api/til?cursor=${previousPage?.nextCursor}&limit=20`;
    },
    { fallbackData },
  );
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
