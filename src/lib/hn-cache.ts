import { Redis } from "@upstash/redis";

import { HackerNewsPost } from "@/types/hackernews";

// Lazy-initialize Redis to avoid errors during build if env vars aren't set
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  return redis;
}

// Cache TTL: 1 hour (matches existing revalidate settings)
const CACHE_TTL = 3600;

// Key prefix for HN posts
const HN_POST_KEY_PREFIX = "hn:post:";
const HN_TOP_IDS_KEY = "hn:top_ids";

/**
 * Get a cached HN post from Redis
 */
export async function getCachedPost(id: string): Promise<HackerNewsPost | null> {
  const client = getRedis();
  if (!client) return null;

  try {
    const cached = await client.get<HackerNewsPost>(`${HN_POST_KEY_PREFIX}${id}`);
    return cached;
  } catch (error) {
    console.error("[HN Cache] Error reading from cache:", error);
    return null;
  }
}

/**
 * Cache an HN post in Redis
 */
export async function setCachedPost(id: string, post: HackerNewsPost): Promise<void> {
  const client = getRedis();
  if (!client) return;

  try {
    await client.set(`${HN_POST_KEY_PREFIX}${id}`, post, { ex: CACHE_TTL });
  } catch (error) {
    console.error("[HN Cache] Error writing to cache:", error);
  }
}

/**
 * Get cached top post IDs
 */
export async function getCachedTopIds(): Promise<number[] | null> {
  const client = getRedis();
  if (!client) return null;

  try {
    const cached = await client.get<number[]>(HN_TOP_IDS_KEY);
    return cached;
  } catch (error) {
    console.error("[HN Cache] Error reading top IDs from cache:", error);
    return null;
  }
}

/**
 * Cache top post IDs (shorter TTL since this changes more frequently)
 */
export async function setCachedTopIds(ids: number[]): Promise<void> {
  const client = getRedis();
  if (!client) return;

  try {
    // Cache for 10 minutes since top stories change frequently
    await client.set(HN_TOP_IDS_KEY, ids, { ex: 600 });
  } catch (error) {
    console.error("[HN Cache] Error writing top IDs to cache:", error);
  }
}

/**
 * Batch get multiple posts from cache
 * Returns a Map of id -> post (null if not cached)
 */
export async function getCachedPosts(ids: string[]): Promise<Map<string, HackerNewsPost | null>> {
  const client = getRedis();
  const result = new Map<string, HackerNewsPost | null>();

  if (!client || ids.length === 0) {
    return result;
  }

  try {
    const keys = ids.map((id) => `${HN_POST_KEY_PREFIX}${id}`);
    const cached = await client.mget<(HackerNewsPost | null)[]>(...keys);

    ids.forEach((id, index) => {
      result.set(id, cached[index] ?? null);
    });
  } catch (error) {
    console.error("[HN Cache] Error batch reading from cache:", error);
  }

  return result;
}

/**
 * Batch set multiple posts to cache
 */
export async function setCachedPosts(posts: Map<string, HackerNewsPost>): Promise<void> {
  const client = getRedis();
  if (!client || posts.size === 0) return;

  try {
    const pipeline = client.pipeline();
    posts.forEach((post, id) => {
      pipeline.set(`${HN_POST_KEY_PREFIX}${id}`, post, { ex: CACHE_TTL });
    });
    await pipeline.exec();
  } catch (error) {
    console.error("[HN Cache] Error batch writing to cache:", error);
  }
}
