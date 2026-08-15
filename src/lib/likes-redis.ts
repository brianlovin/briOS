import { Redis } from "@upstash/redis";

import { type LikeData, MAX_LIKES_PER_USER } from "./likes-constants";

export type { LikeData };

let redis: Redis | null = null;

function getLikesRedis(): Redis | null {
  if (redis) return redis;

  if (!process.env.UPSTASH_LIKES_REST_URL || !process.env.UPSTASH_LIKES_REST_TOKEN) {
    return null;
  }

  redis = new Redis({
    url: process.env.UPSTASH_LIKES_REST_URL,
    token: process.env.UPSTASH_LIKES_REST_TOKEN,
  });

  return redis;
}

// Key prefixes
const TOTAL_PREFIX = "likes:total:";
const USER_LIKES_PREFIX = "likes:user:";
const RATE_LIMIT_PREFIX = "ratelimit:likes:";

// Historical `likes:users:{pageId}` sets are abandoned (not scanned or deleted).
// Viewer state is `likes:user:{userId}:{pageId}` (hash of IP + LIKES_HASH_SALT).

// Constants
const RATE_LIMIT_WINDOW = 60; // seconds
const RATE_LIMIT_MAX = 60; // requests per window

/**
 * Get total like count for a page
 */
export async function getLikeCount(pageId: string): Promise<number> {
  const client = getLikesRedis();
  if (!client) return 0;

  try {
    const count = await client.get<number>(`${TOTAL_PREFIX}${pageId}`);
    return count ?? 0;
  } catch (error) {
    console.error("[Likes] Error getting like count:", error);
    return 0;
  }
}

/**
 * Get a user's like count for a specific page
 */
export async function getUserLikeCount(userId: string, pageId: string): Promise<number> {
  const client = getLikesRedis();
  if (!client) return 0;

  try {
    const count = await client.get<number>(`${USER_LIKES_PREFIX}${userId}:${pageId}`);
    return count ?? 0;
  } catch (error) {
    console.error("[Likes] Error getting user like count:", error);
    return 0;
  }
}

/**
 * Add a like from a user to a page
 * Returns the new total count
 */
export async function addLike(userId: string, pageId: string): Promise<number> {
  const client = getLikesRedis();
  if (!client) return 0;

  try {
    const pipeline = client.pipeline();

    // Increment total count
    pipeline.incr(`${TOTAL_PREFIX}${pageId}`);

    // Increment user's like count for this page
    pipeline.incr(`${USER_LIKES_PREFIX}${userId}:${pageId}`);

    const results = await pipeline.exec();

    // First result is the new total count
    return (results[0] as number) ?? 0;
  } catch (error) {
    console.error("[Likes] Error adding like:", error);
    return 0;
  }
}

/**
 * Remove a like from a user to a page
 * Returns the new total count and user likes
 */
export async function removeLike(
  userId: string,
  pageId: string,
): Promise<{ count: number; userLikes: number }> {
  const client = getLikesRedis();
  if (!client) return { count: 0, userLikes: 0 };

  try {
    // Get current user likes to check if we can decrement
    const currentUserLikes = await getUserLikeCount(userId, pageId);
    if (currentUserLikes <= 0) {
      const count = await getLikeCount(pageId);
      return { count, userLikes: 0 };
    }

    const pipeline = client.pipeline();

    // Decrement total count
    pipeline.decr(`${TOTAL_PREFIX}${pageId}`);

    // Decrement user's like count for this page
    pipeline.decr(`${USER_LIKES_PREFIX}${userId}:${pageId}`);

    const results = await pipeline.exec();

    const newCount = Math.max(0, (results[0] as number) ?? 0);
    const newUserLikes = Math.max(0, (results[1] as number) ?? 0);

    return { count: newCount, userLikes: newUserLikes };
  } catch (error) {
    console.error("[Likes] Error removing like:", error);
    return { count: 0, userLikes: 0 };
  }
}

/**
 * Check rate limit for an IP address
 * Returns true if rate limited, false if allowed
 */
export async function checkRateLimit(ip: string): Promise<boolean> {
  const client = getLikesRedis();
  if (!client) return false; // Allow if Redis unavailable

  try {
    const key = `${RATE_LIMIT_PREFIX}${ip}`;
    const count = await client.incr(key);

    // Set TTL on first request
    if (count === 1) {
      await client.expire(key, RATE_LIMIT_WINDOW);
    }

    return count > RATE_LIMIT_MAX;
  } catch (error) {
    console.error("[Likes] Error checking rate limit:", error);
    return false; // Allow on error
  }
}

/**
 * Get all like counts for syncing to Notion
 * Returns a Map of pageId -> count
 */
export async function getAllLikeCounts(): Promise<Map<string, number>> {
  const client = getLikesRedis();
  const counts = new Map<string, number>();

  if (!client) return counts;

  try {
    let cursor = 0;
    const pattern = `${TOTAL_PREFIX}*`;

    do {
      const [nextCursor, keys] = await client.scan(cursor, { match: pattern, count: 100 });
      cursor = Number(nextCursor);

      if (keys.length > 0) {
        const values = await client.mget<(number | null)[]>(...keys);

        keys.forEach((key, index) => {
          const pageId = key.replace(TOTAL_PREFIX, "");
          const count = values[index];
          if (count !== null && count > 0) {
            counts.set(pageId, count);
          }
        });
      }
    } while (cursor !== 0);

    return counts;
  } catch (error) {
    console.error("[Likes] Error getting all like counts:", error);
    return counts;
  }
}

/**
 * Get the maximum likes per user constant
 */
export function getMaxLikesPerUser(): number {
  return MAX_LIKES_PER_USER;
}

/**
 * Batch get like counts for multiple pages
 * Returns a Map of pageId -> count
 */
export async function getBatchLikeCounts(pageIds: string[]): Promise<Map<string, number>> {
  const client = getLikesRedis();
  const counts = new Map<string, number>();

  if (!client || pageIds.length === 0) return counts;

  try {
    const keys = pageIds.map((id) => `${TOTAL_PREFIX}${id}`);
    const values = await client.mget<(number | null)[]>(...keys);

    pageIds.forEach((pageId, index) => {
      counts.set(pageId, values[index] ?? 0);
    });

    return counts;
  } catch (error) {
    console.error("[Likes] Error getting batch like counts:", error);
    return counts;
  }
}

/**
 * Batch get viewer like data for multiple pages (2N: totals + per-user counts).
 * Returns a Map of pageId -> { count, userLikes }
 */
export async function getBatchUserLikeData(
  userId: string,
  pageIds: string[],
): Promise<Map<string, LikeData>> {
  const client = getLikesRedis();
  const result = new Map<string, LikeData>();

  if (!client || pageIds.length === 0) {
    pageIds.forEach((id) => {
      result.set(id, { count: 0, userLikes: 0 });
    });
    return result;
  }

  try {
    const pipeline = client.pipeline();

    for (const pageId of pageIds) {
      pipeline.get(`${TOTAL_PREFIX}${pageId}`);
    }

    for (const pageId of pageIds) {
      pipeline.get(`${USER_LIKES_PREFIX}${userId}:${pageId}`);
    }

    const results = await pipeline.exec();
    const n = pageIds.length;

    pageIds.forEach((pageId, index) => {
      const count = (results[index] as number | null) ?? 0;
      const userLikes = (results[n + index] as number | null) ?? 0;

      result.set(pageId, { count, userLikes });
    });

    return result;
  } catch (error) {
    console.error("[Likes] Error getting batch user like data:", error);
    pageIds.forEach((id) => {
      result.set(id, { count: 0, userLikes: 0 });
    });
    return result;
  }
}
