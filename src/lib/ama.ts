import type { AmaQuestion } from "@/db/queries/ama";
import { InfiniteScrollPage, useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export type { AmaQuestion };
export type AmaPage = InfiniteScrollPage<AmaQuestion>;

export function useAmaQuestions() {
  return useInfiniteScroll<AmaQuestion>((index: number, previousPage: AmaPage | null) => {
    if (previousPage && !previousPage.nextCursor) return null;
    if (index === 0) return `/api/ama?limit=20`;
    return `/api/ama?cursor=${previousPage?.nextCursor}&limit=20`;
  });
}
