import { Redis } from "@upstash/redis";

import { HackerNewsComment, HackerNewsPost } from "@/types/hackernews";

// Lazy-initialize Redis to avoid errors during build if env vars aren't set
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  if (!process.env.UPSTASH_HN_CACHE_REST_URL || !process.env.UPSTASH_HN_CACHE_REST_TOKEN) {
    return null;
  }

  redis = new Redis({
    url: process.env.UPSTASH_HN_CACHE_REST_URL,
    token: process.env.UPSTASH_HN_CACHE_REST_TOKEN,
  });

  return redis;
}

/** Cache TTL: 1 hour (matches existing revalidate settings). */
export const HN_CACHE_TTL_SECONDS = 3600;

/**
 * Max keys in one MGET or pipeline exec.
 * Post values are comment-free. Comment sidecars are capped, so a full
 * chunk stays under Upstash's 10MB request limit.
 */
export const HN_CACHE_CHUNK_SIZE = 25;

/**
 * Largest trimmed comment tree stored per post.
 * 25 × 256KB = 6.4MB, leaving room for pipeline framing under the 10MB cap.
 * Larger threads are skipped; the detail page loads them from HNPWA.
 */
export const HN_COMMENTS_CACHE_MAX_BYTES = 256 * 1024;

/**
 * v2 stores a comment-free post. v1 `hn:post:{id}` values are full HNPWA
 * items (comment trees included); a 200-key MGET of those exceeded 10MB.
 * v1 keys are never read. They expire within the 1h TTL, and purge still
 * scans `hn:post:*` so a manual purge deletes them immediately.
 */
const HN_POST_KEY_PREFIX = "hn:post:v2:";
const HN_POST_SCAN_PATTERN = "hn:post:*";
const HN_COMMENTS_SUFFIX = ":comments";
const HN_TOP_IDS_KEY = "hn:top_ids";

type HnCachePipeline = {
  set: (key: string, value: unknown, opts?: { ex: number }) => unknown;
  exec: () => Promise<unknown>;
};

type HnPostCacheClient = {
  get: <T>(key: string) => Promise<T | null>;
  set: (key: string, value: unknown, opts?: { ex: number }) => Promise<unknown>;
  mget: <T extends unknown[]>(...keys: string[]) => Promise<T>;
  pipeline: () => HnCachePipeline;
};

function getPostClient(): HnPostCacheClient | null {
  return getRedis() as HnPostCacheClient | null;
}

function postKey(id: string): string {
  return `${HN_POST_KEY_PREFIX}${id}`;
}

function commentsKey(id: string): string {
  return `${HN_POST_KEY_PREFIX}${id}${HN_COMMENTS_SUFFIX}`;
}

function chunkItems<T>(items: readonly T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

/** Drop `comments` without mutating the caller's object. */
export function postWithoutComments(post: HackerNewsPost): HackerNewsPost {
  const copy = { ...post };
  delete copy.comments;
  return copy;
}

function isCachedPost(value: unknown): value is HackerNewsPost {
  if (!value || typeof value !== "object") return false;
  const post = value as Partial<HackerNewsPost>;
  return typeof post.id === "number" && typeof post.title === "string";
}

function asCommentFreePost(value: unknown): HackerNewsPost | null {
  if (!isCachedPost(value)) return null;
  return postWithoutComments(value);
}

function jsonByteLength(value: unknown): number {
  try {
    const json = JSON.stringify(value);
    if (typeof json !== "string") return Number.POSITIVE_INFINITY;
    return new TextEncoder().encode(json).length;
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

/**
 * Get a cached HN post from Redis.
 * Comment trees are not on this key; use `getCachedComments` for a detail read.
 */
export async function getCachedPost(
  id: string,
  client: HnPostCacheClient | null = getPostClient(),
): Promise<HackerNewsPost | null> {
  if (!client) return null;

  try {
    const cached = await client.get<unknown>(postKey(id));
    return asCommentFreePost(cached);
  } catch (error) {
    console.error("[HN Cache] Error reading from cache:", error);
    return null;
  }
}

/**
 * Trimmed comments for one post. Read only by single-item detail fetches,
 * never by the batch MGET.
 * `[]` is a cached empty thread. `null` is a miss.
 */
export async function getCachedComments(
  id: string,
  client: HnPostCacheClient | null = getPostClient(),
): Promise<HackerNewsComment[] | null> {
  if (!client) return null;

  try {
    const cached = await client.get<unknown>(commentsKey(id));
    if (!Array.isArray(cached)) return null;
    return cached as HackerNewsComment[];
  } catch (error) {
    console.error("[HN Cache] Error reading comments from cache:", error);
    return null;
  }
}

/**
 * Cache an HN post in Redis. Any `comments` on `post` are removed first.
 */
export async function setCachedPost(
  id: string,
  post: HackerNewsPost,
  client: HnPostCacheClient | null = getPostClient(),
): Promise<void> {
  await setCachedPosts(new Map([[id, post]]), client);
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
 * Cache top post IDs
 */
export async function setCachedTopIds(ids: number[]): Promise<void> {
  const client = getRedis();
  if (!client) return;

  try {
    // Cache for 1 hour to match page revalidate and post TTL
    await client.set(HN_TOP_IDS_KEY, ids, { ex: HN_CACHE_TTL_SECONDS });
  } catch (error) {
    console.error("[HN Cache] Error writing top IDs to cache:", error);
  }
}

/**
 * Batch get multiple posts from cache.
 * Returns a Map of id -> comment-free post (null if not cached).
 * MGET is chunked so one response cannot exceed Upstash's request limit.
 */
export async function getCachedPosts(
  ids: string[],
  client: HnPostCacheClient | null = getPostClient(),
): Promise<Map<string, HackerNewsPost | null>> {
  const result = new Map<string, HackerNewsPost | null>();
  if (!client || ids.length === 0) return result;

  for (const chunk of chunkItems(ids, HN_CACHE_CHUNK_SIZE)) {
    try {
      const keys = chunk.map((id) => postKey(id));
      const cached = await client.mget<(HackerNewsPost | null)[]>(...keys);
      const values = Array.isArray(cached) ? cached : [];
      chunk.forEach((id, index) => {
        result.set(id, asCommentFreePost(values[index]));
      });
    } catch (error) {
      console.error("[HN Cache] Error batch reading from cache:", error);
    }
  }

  return result;
}

/**
 * Batch set multiple posts to cache.
 * Values are stored without comments. Writes are chunked pipelines of SETs
 * with the 1h TTL (MSET cannot set a per-key expiry).
 */
export async function setCachedPosts(
  posts: Map<string, HackerNewsPost>,
  client: HnPostCacheClient | null = getPostClient(),
): Promise<void> {
  if (!client || posts.size === 0) return;

  for (const chunk of chunkItems([...posts.entries()], HN_CACHE_CHUNK_SIZE)) {
    try {
      const pipeline = client.pipeline();
      for (const [id, post] of chunk) {
        pipeline.set(postKey(id), postWithoutComments(post), { ex: HN_CACHE_TTL_SECONDS });
      }
      await pipeline.exec();
    } catch (error) {
      console.error("[HN Cache] Error batch writing to cache:", error);
    }
  }
}

/**
 * Store trimmed comment trees on per-post keys. Never included in the post MGET.
 * Payloads over `HN_COMMENTS_CACHE_MAX_BYTES` are skipped.
 */
export async function setCachedComments(
  commentsById: Map<string, HackerNewsComment[]>,
  client: HnPostCacheClient | null = getPostClient(),
): Promise<void> {
  if (!client || commentsById.size === 0) return;

  const entries: [string, HackerNewsComment[]][] = [];
  for (const [id, comments] of commentsById) {
    if (!Array.isArray(comments)) continue;
    if (jsonByteLength(comments) > HN_COMMENTS_CACHE_MAX_BYTES) {
      console.warn(
        `[HN Cache] Skipping comments for ${id}: payload exceeds ${HN_COMMENTS_CACHE_MAX_BYTES} bytes`,
      );
      continue;
    }
    entries.push([id, comments]);
  }

  for (const chunk of chunkItems(entries, HN_CACHE_CHUNK_SIZE)) {
    try {
      const pipeline = client.pipeline();
      for (const [id, comments] of chunk) {
        pipeline.set(commentsKey(id), comments, { ex: HN_CACHE_TTL_SECONDS });
      }
      await pipeline.exec();
    } catch (error) {
      console.error("[HN Cache] Error batch writing comments to cache:", error);
    }
  }
}

/** Minimal Redis surface used by `clearHnCache` (HN cache DB only). */
export type HnCacheRedis = {
  del: (...keys: string[]) => Promise<number>;
  scan: (cursor: string, opts: { match: string; count: number }) => Promise<[string, string[]]>;
};

/**
 * Delete the top-ids key and every `hn:post:*` entry in the HN Redis DB,
 * including legacy full payloads, v2 posts, and comment sidecars.
 * Used by `/api/purge-cache?type=hn` — do not call the Notion cache helper.
 */
export async function clearHnCache(client: HnCacheRedis | null = getRedis()): Promise<number> {
  if (!client) return 0;

  try {
    let deleted = await client.del(HN_TOP_IDS_KEY);

    let cursor = "0";
    do {
      const result: [string, string[]] = await client.scan(cursor, {
        match: HN_POST_SCAN_PATTERN,
        count: 100,
      });
      cursor = result[0];
      const keys = result[1];

      if (keys.length > 0) {
        deleted += await client.del(...keys);
      }
    } while (cursor !== "0");

    console.log(`[HN Cache] Invalidated ${deleted} keys`);
    return deleted;
  } catch (error) {
    console.error("[HN Cache] Error clearing cache:", error);
    return 0;
  }
}
