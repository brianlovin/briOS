import { cacheLife, cacheTag } from "next/cache";

import { getWritingPosts as getWritingPostsFromDb, type WritingPost } from "@/db/queries/writing";

export async function getAllWritingPosts(): Promise<WritingPost[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("writing");

  const all: WritingPost[] = [];
  let cursor: string | undefined;
  do {
    const { items, nextCursor } = await getWritingPostsFromDb(cursor, 100);
    all.push(...items);
    cursor = nextCursor ?? undefined;
  } while (cursor);
  return all;
}
