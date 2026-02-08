import { cache } from "react";

import { getWritingPosts as getWritingPostsFromDb, type WritingPost } from "@/db/queries/writing";

async function fetchAllWritingPosts(): Promise<WritingPost[]> {
  let allPosts: WritingPost[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const { items, nextCursor } = await getWritingPostsFromDb(cursor, 100);
    allPosts = [...allPosts, ...items];
    cursor = nextCursor || undefined;
    hasMore = !!nextCursor;
  }

  return allPosts;
}

// Request-level dedup: prevents duplicate calls within a single render
export const getAllWritingPosts = cache(fetchAllWritingPosts);
