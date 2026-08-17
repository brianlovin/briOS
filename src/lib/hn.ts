import { unstable_cache } from "next/cache";
import { cache } from "react";

import { externalFetcher } from "@/lib/fetcher";
import {
  getCachedPost,
  getCachedPosts,
  getCachedTopIds,
  setCachedPost,
  setCachedPosts,
  setCachedTopIds,
} from "@/lib/hn-cache";
import { sanitizeExternalHtml } from "@/lib/sanitize";
import { HackerNewsComment, HackerNewsPost } from "@/types/hackernews";

/** Default revalidation for HN data (matches Redis cache TTL). */
const HN_REVALIDATE = 3600;

const BASE_URL = "https://brianlovin.com";
const TOP_BASE_URL = "https://hacker-news.firebaseio.com/v0";
const ITEM_BASE_URL = "https://api.hnpwa.com/v0";

// Conditional logging helper - only logs in development
const log = (...args: unknown[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};

const fetchPostIds = async (): Promise<number[]> => {
  try {
    const cachedIds = await getCachedTopIds();
    if (cachedIds) {
      log("[HN] Using cached top IDs");
      return cachedIds;
    }
  } catch {
    // Redis failed, continue to API
  }

  const ids = await externalFetcher<number[]>(`${TOP_BASE_URL}/topstories.json`);

  // Fire-and-forget cache write
  setCachedTopIds(ids).catch(() => {});

  return ids;
};

export const getPostIds = unstable_cache(fetchPostIds, ["hn:post-ids"], {
  revalidate: HN_REVALIDATE,
  tags: ["hn:post-ids"],
});

// Helper to trim comments to reduce payload size
function trimComments(comment: HackerNewsComment): HackerNewsComment | null {
  if (!comment) return null;

  if (comment.level > 3) {
    return null;
  }

  return {
    ...comment,
    content: comment.content ? sanitizeExternalHtml(comment.content) : comment.content,
    comments: comment.comments.slice(0, 8).map(trimComments).filter(Boolean) as HackerNewsComment[],
  };
}

// Project raw post data. Comments are omitted unless includeComments is set so
// `[]` only means "detail fetch, empty thread" — never "list row, stripped".
export function processPost(data: HackerNewsPost, includeComments: boolean): HackerNewsPost {
  const cleanUrl = data.domain ? `${data.url}` : `${BASE_URL}/hn/${data.id}`;
  const projected: HackerNewsPost = {
    ...data,
    content: data.content ? sanitizeExternalHtml(data.content) : data.content,
    url: cleanUrl,
  };

  if (includeComments) {
    projected.comments = (data.comments ?? [])
      .slice(0, 12)
      .map(trimComments)
      .filter(Boolean) as HackerNewsComment[];
  } else {
    delete projected.comments;
  }

  return projected;
}

// Fetch post from external API (no caching)
async function fetchPostFromApi(id: string): Promise<HackerNewsPost | null> {
  try {
    const post = await externalFetcher<HackerNewsPost>(`${ITEM_BASE_URL}/item/${id}.json`);
    return post;
  } catch {
    return null;
  }
}

// Batch fetch posts with Redis cache optimization
async function getBatchPosts(
  ids: string[],
  includeComments: boolean,
): Promise<(HackerNewsPost | null)[]> {
  // Batch-fetch from Redis cache
  const cachedPosts = await getCachedPosts(ids);

  // Identify cache hits and misses
  const results: (HackerNewsPost | null)[] = new Array(ids.length).fill(null);
  const missedIds: { index: number; id: string }[] = [];

  ids.forEach((id, index) => {
    const cached = cachedPosts.get(id);
    if (cached) {
      results[index] = processPost(cached, includeComments);
    } else {
      missedIds.push({ index, id });
    }
  });

  if (missedIds.length > 0) {
    log(`[HN] Batch cache: ${ids.length - missedIds.length} hits, ${missedIds.length} misses`);

    // Fetch misses from API in parallel
    const fetchPromises = missedIds.map(async ({ index, id }) => {
      const data = await fetchPostFromApi(id);
      return { index, id, data };
    });
    const fetched = await Promise.all(fetchPromises);

    // Collect posts to batch-write to cache
    const toCache = new Map<string, HackerNewsPost>();

    fetched.forEach(({ index, id, data }) => {
      if (data) {
        results[index] = processPost(data, includeComments);
        toCache.set(id, data);
      }
    });

    // Fire-and-forget batch cache write
    if (toCache.size > 0) {
      setCachedPosts(toCache).catch(() => {});
    }
  } else {
    log(`[HN] Batch cache: ${ids.length} hits, 0 misses`);
  }

  return results;
}

const fetchPostById = unstable_cache(
  async (id: string, includeComments: boolean): Promise<HackerNewsPost | null> => {
    // Try Redis cache first
    const cached = await getCachedPost(id);
    if (cached) {
      log(`[HN] Cache hit for post ${id}`);
      return processPost(cached, includeComments);
    }

    log(`[HN] Cache miss for post ${id}`);
    const data = await fetchPostFromApi(id);

    if (!data) return null;

    // Fire-and-forget cache write
    setCachedPost(id, data).catch(() => {});

    return processPost(data, includeComments);
  },
  ["hn:post"],
  { revalidate: HN_REVALIDATE, tags: ["hn:post"] },
);

// Wrapped with React cache() for request-level deduplication during SSR.
// The inner unstable_cache persists across requests, so Server Components
// rendering with these posts can be ISR'd instead of bailed to dynamic.
export const getPostById = cache(
  async (id: string, includeComments = false): Promise<HackerNewsPost | null> => {
    return fetchPostById(id, includeComments);
  },
);

export const getRankedHNPosts = unstable_cache(
  async (): Promise<HackerNewsPost[]> => {
    const topPostIds = await fetchPostIds();

    // Fetch 200 most recent posts
    const filtered = topPostIds.sort((a: number, b: number) => b - a).slice(0, 200);
    const ids = filtered.map((id) => id.toString());
    const posts = await getBatchPosts(ids, false);

    const now = new Date().getTime() / 1000;
    const oneDayAgo = now - 60 * 60 * 24;

    // Filter out null posts
    const validPosts = posts.filter((post): post is HackerNewsPost => post !== null);

    // Only show links (exclude jobs, polls)
    const links = validPosts.filter((post) => post.type === "link");

    // Only show posts from last 24 hours
    const withinLastDay = links.filter((post) => post.time > oneDayAgo);

    // Filter by minimum engagement (50+ points OR 20+ comments)
    const highEngagement = withinLastDay.filter(
      (post) => (post.points || 0) >= 50 || post.comments_count >= 20,
    );

    // Sort by weighted score: points + (comments * 0.75) + recency bonus
    const sorted = highEngagement.sort((a, b) => {
      const hoursOldA = (now - a.time) / 3600;
      const hoursOldB = (now - b.time) / 3600;

      // Recency bonus: newer posts get higher scores (decays from 100 to 0 over 24 hours)
      const recencyBonusA = Math.max(0, 100 * (1 - hoursOldA / 24));
      const recencyBonusB = Math.max(0, 100 * (1 - hoursOldB / 24));

      const scoreA = (a.points || 0) + a.comments_count * 0.75 + recencyBonusA;
      const scoreB = (b.points || 0) + b.comments_count * 0.75 + recencyBonusB;

      return scoreB - scoreA;
    });

    const top24 = sorted.slice(0, 24);

    log(`[HN Filtered] Returning top ${top24.length} posts by weighted score`);

    return top24;
  },
  ["hn:ranked"],
  { revalidate: HN_REVALIDATE, tags: ["hn:ranked"] },
);

const DIGEST_WINDOW_SECONDS = 60 * 60 * 24;
const DIGEST_POST_LIMIT = 16;

/**
 * Pick digest stories from already-fetched posts: links only, last 24h,
 * top 16 by points. Pure so the daily send cannot inherit a dateless
 * `unstable_cache` snapshot (see getHNPostsForDigest).
 */
export function selectHNPostsForDigest(
  posts: (HackerNewsPost | null)[],
  nowSeconds: number = Date.now() / 1000,
): HackerNewsPost[] {
  const dayAgo = nowSeconds - DIGEST_WINDOW_SECONDS;

  const links = posts.filter(
    (post): post is HackerNewsPost => post !== null && post.type === "link",
  );
  const withinLastDay = links.filter((post) => post.time > dayAgo);
  return withinLastDay
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, DIGEST_POST_LIMIT);
}

/**
 * Fresh fetch for the daily email. Do not wrap this in `unstable_cache`
 * with a dateless key — that can survive past the 1h revalidate on Vercel
 * cron and send yesterday's identical snapshot.
 */
export async function getHNPostsForDigest(): Promise<HackerNewsPost[]> {
  const topPostIds = await fetchPostIds();
  log(`[HN Digest] Starting with ${topPostIds.length} total story IDs`);

  // topPostIds returns 500 by default. this can block the API route from
  // responding for a long time while each one is fetched individually.
  // it's much more likely that the most recent 200 (by decrementing id) are
  // the top posts within the last 24 hours
  const filtered = topPostIds.sort((a: number, b: number) => b - a).slice(0, 200);
  log(`[HN Digest] Filtered to top 200 most recent IDs`);

  const ids = filtered.map((id) => id.toString());
  const posts = await getBatchPosts(ids, false);

  const top16 = selectHNPostsForDigest(posts);

  log(`[HN Digest] Returning top ${top16.length} posts by points`);

  return top16;
}
