import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { getBatchLikeCounts, type LikeData } from "./likes-redis";

export type { LikeData };

/**
 * Server-side function to get batch like counts for multiple pages.
 * Returns counts only (no user-specific data).
 * User-specific data (hasLiked, userLikes) is fetched client-side.
 */
export async function getServerLikes(pageIds: string[]): Promise<Record<string, LikeData>> {
  "use cache";
  cacheLife("minutes");
  cacheTag("likes");

  if (pageIds.length === 0) return {};

  const counts = await getBatchLikeCounts(pageIds);

  const result: Record<string, LikeData> = {};
  for (const pageId of pageIds) {
    result[pageId] = {
      count: counts.get(pageId) ?? 0,
      userLikes: 0,
      hasLiked: false,
      canLike: true,
    };
  }

  return result;
}
