import "server-only";

import { unstable_cache } from "next/cache";

import { getBatchLikeCounts, type LikeData } from "./likes-redis";

export type { LikeData };

/**
 * Revalidate matches the default page revalidate (1h) so wrapping this call
 * does NOT force pages to regenerate more often than they otherwise would
 * (Next.js uses the minimum revalidate across all layers of a route).
 *
 * Client-side SWR inside BatchLikesProvider refreshes counts live after
 * hydration, so the server-rendered count lagging by up to 1h is acceptable.
 */
const LIKES_REVALIDATE = 3600;

/**
 * Server-side function to get batch like counts for multiple pages.
 * Returns counts only (no user-specific data).
 * User-specific data (hasLiked, userLikes) is fetched client-side.
 *
 * Wrapped in `unstable_cache` so Server Components using it can be ISR'd
 * instead of bailed to dynamic rendering (Upstash REST calls are uncached
 * fetch POSTs that otherwise force a route dynamic).
 */
export const getServerLikes = unstable_cache(
  async (pageIds: string[]): Promise<Record<string, LikeData>> => {
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
  },
  ["likes:server"],
  { revalidate: LIKES_REVALIDATE, tags: ["likes:server"] },
);
