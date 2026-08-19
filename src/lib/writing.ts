import { cache } from "react";

import { InfiniteScrollPage, useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getWritingDatabaseItems, NotionWritingItem } from "@/lib/notion";
import { buildSlug } from "@/lib/short-id";

export type WritingPage = InfiniteScrollPage<NotionWritingItem>;

export function useWritingPosts() {
  return useInfiniteScroll<NotionWritingItem>((index: number, previousPage: WritingPage | null) => {
    if (previousPage && !previousPage.nextCursor) return null;
    if (index === 0) return `/api/writing?limit=20`;
    return `/api/writing?cursor=${previousPage?.nextCursor}&limit=20`;
  });
}

async function fetchAllWritingPosts(): Promise<NotionWritingItem[]> {
  let allPosts: NotionWritingItem[] = [];
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

// Request-level dedup: prevents duplicate calls within a single render
export const getAllWritingPosts = cache(fetchAllWritingPosts);

export function writingPostLink(post: Pick<NotionWritingItem, "id" | "title" | "shortId">) {
  if (!post.shortId) return null;
  return {
    id: post.id,
    title: post.title,
    href: `/writing/${buildSlug(post.title, post.shortId)}`,
  };
}

export function recentWritingLinks(posts: NotionWritingItem[]) {
  return posts
    .slice(0, 5)
    .filter((post): post is NotionWritingItem & { shortId: string } => Boolean(post.shortId))
    .map((post) => ({
      id: post.id,
      title: post.title,
      href: `/writing/${buildSlug(post.title, post.shortId)}`,
    }));
}
