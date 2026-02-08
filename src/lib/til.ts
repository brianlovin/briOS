import type { TilEntry } from "@/db/queries/til";
import { InfiniteScrollPage, useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export type { TilEntry };
export type TilPage = InfiniteScrollPage<TilEntry>;

export function useTilEntries() {
  return useInfiniteScroll<TilEntry>((index: number, previousPage: TilPage | null) => {
    if (previousPage && !previousPage.nextCursor) return null;
    if (index === 0) return `/api/til?limit=20`;
    return `/api/til?cursor=${previousPage?.nextCursor}&limit=20`;
  });
}
