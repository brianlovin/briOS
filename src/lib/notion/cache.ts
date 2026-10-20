import { Redis } from "@upstash/redis";
import { unstable_cache } from "next/cache";

import { toErrorMessage } from "@/lib/axiom";
import { logger } from "@/lib/logger";

// Lazy-initialize Redis to avoid errors during build if env vars aren't set
let redis: Redis | null = null;

export function getNotionCacheRedis(): Redis | null {
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

/** CI sets `NOTION_TOKEN=build-placeholder` so prerender must not call Notion. */
export function isPlaceholderNotionBuild(): boolean {
  return process.env.NOTION_TOKEN === "build-placeholder";
}

export const CACHE_TTLS = {
  /** Listings (1 hour) */
  LIST: 3600,
  /** Individual page content (24 hours) */
  CONTENT: 86400,
  /** Data source IDs — rarely change (24 hours) */
  DATA_SOURCE: 86400,
} as const;

/**
 * Bumped when the serialized ProcessedBlock shape changes so Next (24h) and
 * Redis (7d) cannot serve the old grab-bag payload as the new union.
 */
export const CONTENT_CACHE_VERSION = "v2";

/**
 * Cache key for processed page content.
 * `notionContentCacheKey("writing", pageId)` → `notion:writing:content:v2:<id>`
 * `notionContentCacheKey(null, pageId)` → `notion:content:v2:<id>`
 */
export function notionContentCacheKey(collection: string | null, ...parts: string[]): string {
  if (collection) {
    return ["notion", collection, "content", CONTENT_CACHE_VERSION, ...parts].join(":");
  }
  return ["notion", "content", CONTENT_CACHE_VERSION, ...parts].join(":");
}

/** Redis key TTL: 7 days (emergency fallback window) */
const REDIS_KEY_TTL = 7 * 24 * 3600;

interface CachedNotionQueryOptions {
  /** Freshness TTL in seconds */
  ttl: number;
}

/**
 * Derive a coarse cache tag from a key like `notion:writing:content:v2:<id>`.
 * Returns the first two segments so a whole content type can be invalidated
 * at once via `revalidateTag("notion:writing", { expire: 0 })`.
 */
export function deriveTag(key: string): string {
  return key.split(":").slice(0, 2).join(":");
}

/**
 * Inner fetch with Upstash-backed cache + stale-on-error fallback.
 *
 * 1. Check Redis — if fresh (within `ttl`), return immediately (no Notion call)
 * 2. If stale or missing — call Notion via `fetcher()`
 * 3. On Notion success — update Redis, return fresh data
 * 4. On Notion failure + stale cache exists — return stale data (log warning)
 * 5. On Notion failure + no cache — throw (only possible on first-ever request during outage)
 */
async function upstashBackedQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CachedNotionQueryOptions,
): Promise<T> {
  const client = getNotionCacheRedis();

  if (!client) {
    return fetcher();
  }

  let cached: CachedEntry<T> | null = null;
  try {
    cached = await client.get<CachedEntry<T>>(key);
  } catch (error) {
    logger.warn("[Notion Cache] Redis read error", { key, error_message: toErrorMessage(error) });
  }

  const now = Date.now();
  const isFresh = cached && now - cached.cachedAt < options.ttl * 1000;

  if (isFresh) {
    return cached!.data;
  }

  try {
    const data = await fetcher();

    const entry: CachedEntry<T> = { data, cachedAt: now };
    try {
      await client.set(key, entry, { ex: REDIS_KEY_TTL });
    } catch (error) {
      logger.warn("[Notion Cache] Redis write error", {
        key,
        error_message: toErrorMessage(error),
      });
    }

    return data;
  } catch (fetchError) {
    if (cached) {
      logger.warn("[Notion Cache] Notion fetch failed, serving stale cache", {
        key,
        cached_at: new Date(cached.cachedAt).toISOString(),
        error_message: toErrorMessage(fetchError),
      });
      return cached.data;
    }

    throw fetchError;
  }
}

/**
 * Two-layer cache for Notion queries:
 *
 * 1. Next.js data cache (`unstable_cache`) — primary. Makes the I/O visible to
 *    Next's caching system so Server Components using it can be statically
 *    rendered / ISR'd instead of bailed to dynamic rendering.
 * 2. Upstash Redis — secondary. Preserves the stale-on-error fallback across
 *    Next.js cache evictions and across deployments.
 *
 * Dev mode bypasses both layers so local changes are visible without waiting
 * on any cache expiry.
 */
export async function cachedNotionQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CachedNotionQueryOptions,
): Promise<T> {
  if (process.env.NODE_ENV === "development") {
    return fetcher();
  }

  const tag = deriveTag(key);
  const cached = unstable_cache(() => upstashBackedQuery<T>(key, fetcher, options), [key], {
    revalidate: options.ttl,
    tags: [tag, key],
  });

  return cached();
}

/**
 * Invalidate cache entries matching a prefix pattern.
 * Uses Redis SCAN to find and delete matching keys.
 */
export async function invalidateNotionCache(pattern: string): Promise<number> {
  const client = getNotionCacheRedis();
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
    logger.error(`[Notion Cache] Error invalidating cache for ${pattern}`, error);
    return 0;
  }
}

/**
 * Every `notion:<collection>` tag that currently has Redis entries, so a
 * site-wide purge also reaches collections without a `PURGE_CONFIG` entry.
 */
export async function listNotionCacheTags(): Promise<string[]> {
  const client = getNotionCacheRedis();
  if (!client) return [];

  const tags = new Set<string>();
  try {
    let cursor = "0";
    do {
      const [next, keys]: [string, string[]] = await client.scan(cursor, {
        match: "notion:*",
        count: 500,
      });
      cursor = next;
      for (const key of keys) tags.add(deriveTag(key));
    } while (cursor !== "0");
  } catch (error) {
    logger.warn("[Notion Cache] Tag scan failed", { error_message: toErrorMessage(error) });
  }
  return [...tags].sort();
}
