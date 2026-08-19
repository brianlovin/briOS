import "server-only";

import { unstable_cache } from "next/cache";

import { type LikeCount, LIKES_SERVER_CACHE_TAG } from "./likes-constants";
import { getBatchLikeCounts } from "./likes-redis";

export type { LikeCount, LikeData } from "./likes-constants";

/**
 * Revalidate matches the default page revalidate (1h) so wrapping this call
 * does NOT force pages to regenerate more often than they otherwise would
 * (Next.js uses the minimum revalidate across all layers of a route).
 *
 * Client-side batch fetch inside BatchLikesProvider overlays viewer state
 * after hydration, so the server-rendered count lagging by up to 1h is acceptable.
 */
const LIKES_REVALIDATE = 3600;

/**
 * Server-side function to get batch like counts for multiple pages.
 * Returns counts only — viewer state is unknown until the client batch overlay.
 *
 * Wrapped in `unstable_cache` so Server Components using it can be ISR'd
 * instead of bailed to dynamic rendering (Upstash REST calls are uncached
 * fetch POSTs that otherwise force a route dynamic).
 */
export const getServerLikes = unstable_cache(
  async (pageIds: string[]): Promise<Record<string, LikeCount>> => {
    if (pageIds.length === 0) return {};

    const counts = await getBatchLikeCounts(pageIds);

    const result: Record<string, LikeCount> = {};
    for (const pageId of pageIds) {
      result[pageId] = { count: counts.get(pageId) ?? 0 };
    }

    return result;
  },
  [LIKES_SERVER_CACHE_TAG],
  { revalidate: LIKES_REVALIDATE, tags: [LIKES_SERVER_CACHE_TAG] },
);
