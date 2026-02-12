import type { WritingPost } from "@/db/queries/writing";
import { InfiniteScrollPage, useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export type { WritingPost };
export type WritingPage = InfiniteScrollPage<WritingPost>;

export function useWritingPosts() {
  return useInfiniteScroll<WritingPost>((index: number, previousPage: WritingPage | null) => {
    if (previousPage && !previousPage.nextCursor) return null;
    if (index === 0) return `/api/writing?limit=20`;
    return `/api/writing?cursor=${previousPage?.nextCursor}&limit=20`;
  });
}
