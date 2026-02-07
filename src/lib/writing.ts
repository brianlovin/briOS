import { unstable_cache } from "next/cache";
import { cache } from "react";

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

async function fetchAllWritingPosts(): Promise<NotionItem[]> {
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

// Cross-request cache: avoids re-fetching from Notion on every ISR revalidation
const getCachedWritingPosts = unstable_cache(fetchAllWritingPosts, ["writing-posts"], {
  revalidate: 3600,
  tags: ["writing-posts"],
});

// Request-level dedup: prevents duplicate calls within a single render
// (e.g. generateStaticParams + page component during build)
export const getAllWritingPosts = cache(getCachedWritingPosts);
