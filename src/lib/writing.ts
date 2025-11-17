import { InfiniteScrollPage, useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getWritingDatabaseItems, NotionItem } from "@/lib/notion";

export type WritingPage = InfiniteScrollPage<NotionItem>;

export function useWritingPosts() {
  return useInfiniteScroll<NotionItem>((index: number, previousPage: WritingPage | null) => {
    if (previousPage && !previousPage.nextCursor) return null;
    if (index === 0) return `/api/writing?limit=20`;
    return `/api/writing?cursor=${previousPage?.nextCursor}&limit=20`;
  });
}

export async function getAllWritingPosts(): Promise<NotionItem[]> {
  let allPosts: NotionItem[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const { items, nextCursor } = await getWritingDatabaseItems(cursor, 100);
    allPosts = [...allPosts, ...items];
    cursor = nextCursor || undefined;
    hasMore = !!nextCursor;
  }

  return allPosts;
}
