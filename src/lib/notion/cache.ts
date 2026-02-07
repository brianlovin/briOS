import { Redis } from "@upstash/redis";

// Lazy-initialize Redis to avoid errors during build if env vars aren't set
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  if (!process.env.UPSTASH_NOTION_CACHE_REST_URL || !process.env.UPSTASH_NOTION_CACHE_REST_TOKEN) {
    return null;
  }

  redis = new Redis({
    url: process.env.UPSTASH_NOTION_CACHE_REST_URL,
    token: process.env.UPSTASH_NOTION_CACHE_REST_TOKEN,
  });

  return redis;
}

interface CachedEntry<T> {
  data: T;
  cachedAt: number;
}

export const CACHE_TTLS = {
  /** Listings (1 hour) */
  LIST: 3600,
  /** Individual page content (24 hours) */
  CONTENT: 86400,
  /** Data source IDs — rarely change (24 hours) */
  DATA_SOURCE: 86400,
} as const;

/** Redis key TTL: 7 days (emergency fallback window) */
const REDIS_KEY_TTL = 7 * 24 * 3600;

interface CachedNotionQueryOptions {
  /** Freshness TTL in seconds */
  ttl: number;
}

/**
 * Redis-backed cache for Notion queries with stale-on-error fallback.
 *
 * 1. Check Redis — if fresh (within `ttl`), return immediately (no Notion call)
 * 2. If stale or missing — call Notion via `fetcher()`
 * 3. On Notion success — update Redis, return fresh data
 * 4. On Notion failure + stale cache exists — return stale data (log warning)
 * 5. On Notion failure + no cache — throw (only possible on first-ever request during outage)
 */
export async function cachedNotionQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CachedNotionQueryOptions,
): Promise<T> {
  const client = getRedis();

  // If Redis is unavailable, fall through to Notion directly
  if (!client) {
    return fetcher();
  }

  // Step 1: Check Redis
  let cached: CachedEntry<T> | null = null;
  try {
    cached = await client.get<CachedEntry<T>>(key);
  } catch (error) {
    console.warn(`[Notion Cache] Redis read error for ${key}:`, error);
  }

  const now = Date.now();
  const isFresh = cached && now - cached.cachedAt < options.ttl * 1000;

  if (isFresh) {
    return cached!.data;
  }

  // Step 2: Stale or missing — call Notion
  try {
    const data = await fetcher();

    // Step 3: On success — update Redis
    const entry: CachedEntry<T> = { data, cachedAt: now };
    try {
      await client.set(key, entry, { ex: REDIS_KEY_TTL });
    } catch (error) {
      console.warn(`[Notion Cache] Redis write error for ${key}:`, error);
    }

    return data;
  } catch (fetchError) {
    // Step 4: On Notion failure + stale cache exists — return stale data
    if (cached) {
      console.warn(
        `[Notion Cache] Notion fetch failed for ${key}, serving stale cache from ${new Date(cached.cachedAt).toISOString()}:`,
        fetchError,
      );
      return cached.data;
    }

    // Step 5: On Notion failure + no cache — throw
    throw fetchError;
  }
}

/**
 * Invalidate cache entries matching a prefix pattern.
 * Uses Redis SCAN to find and delete matching keys.
 */
export async function invalidateNotionCache(pattern: string): Promise<number> {
  const client = getRedis();
  if (!client) return 0;

  try {
    let cursor = "0";
    let deleted = 0;

    do {
      const result: [string, string[]] = await client.scan(cursor, {
        match: pattern,
        count: 100,
      });
      cursor = result[0];
      const keys = result[1];

      if (keys.length > 0) {
        await client.del(...keys);
        deleted += keys.length;
      }
    } while (cursor !== "0");

    console.log(`[Notion Cache] Invalidated ${deleted} keys matching ${pattern}`);
    return deleted;
  } catch (error) {
    console.error(`[Notion Cache] Error invalidating cache for ${pattern}:`, error);
    return 0;
  }
}
