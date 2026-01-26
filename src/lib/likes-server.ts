import "server-only";

import { unstable_cache } from "next/cache";

import { getBatchLikeCounts, type LikeData } from "./likes-redis";

export type { LikeData };

/**
 * Server-side function to get batch like counts for multiple pages.
 * Returns counts only (no user-specific data) to preserve ISR caching.
 * User-specific data (hasLiked, userLikes) is fetched client-side.
 *
 * Wrapped with unstable_cache to allow static generation while still
 * fetching fresh counts periodically.
 */
export async function getServerLikes(pageIds: string[]): Promise<Record<string, LikeData>> {
  if (pageIds.length === 0) return {};

  // Cache key based on sorted page IDs for consistency
  const cacheKey = pageIds.slice().sort().join(",");

  const getCachedLikeCounts = unstable_cache(
    async (ids: string[]) => {
      const counts = await getBatchLikeCounts(ids);
      // Convert Map to plain object for serialization
      const result: Record<string, number> = {};
      counts.forEach((count, pageId) => {
        result[pageId] = count;
      });
      return result;
    },
    ["likes-counts", cacheKey],
    {
      revalidate: 60, // Revalidate every 60 seconds
      tags: ["likes"],
    },
  );

  const counts = await getCachedLikeCounts(pageIds);

  // Convert to LikeData with default user values
  const result: Record<string, LikeData> = {};
  for (const pageId of pageIds) {
    result[pageId] = {
      count: counts[pageId] ?? 0,
      userLikes: 0,
      hasLiked: false,
      canLike: true,
    };
  }

  return result;
}
