import { revalidatePath, revalidateTag } from "next/cache";

import { invalidateNotionCache } from "./cache";

export const PURGEABLE_CONTENT_TYPES = ["writing", "til", "ama", "stack", "sites"] as const;
export type PurgeableContentType = (typeof PURGEABLE_CONTENT_TYPES)[number];

export const PURGE_CACHE_TYPES = [...PURGEABLE_CONTENT_TYPES, "all"] as const;
export type PurgeCacheType = (typeof PURGE_CACHE_TYPES)[number];

/**
 * Redis key patterns, Next cache tags, and paths to revalidate per content type.
 * `pagePaths` holds dynamic-segment paths that require the "page" type arg to
 * `revalidatePath` — without it, individual slug/id pages keep serving stale HTML.
 *
 * Prefixes match `cachedNotionQuery` keys in `queries.ts`:
 * - writing → `notion:writing:*` (list + content by id/slug/shortId)
 * - til → `notion:til:*`
 * - ama → `notion:ama:*`
 * - stack → `notion:stack:*`
 * - sites → `notion:good-websites:*` (list + rss; content type name ≠ Redis prefix)
 */
export const PURGE_CONFIG: Record<
  PurgeableContentType,
  { patterns: string[]; tags: string[]; paths: string[]; pagePaths: string[] }
> = {
  writing: {
    patterns: ["notion:writing:*"],
    tags: ["notion:writing"],
    paths: ["/writing", "/api/writing"],
    pagePaths: ["/writing/[slug]"],
  },
  til: {
    patterns: ["notion:til:*"],
    tags: ["notion:til"],
    paths: ["/til", "/api/til"],
    pagePaths: ["/til/[slug]"],
  },
  ama: {
    patterns: ["notion:ama:*"],
    tags: ["notion:ama"],
    paths: ["/ama", "/api/ama"],
    pagePaths: ["/ama/[id]"],
  },
  stack: {
    patterns: ["notion:stack:*"],
    tags: ["notion:stack"],
    paths: ["/stack", "/api/stacks"],
    pagePaths: [],
  },
  sites: {
    patterns: ["notion:good-websites:*"],
    tags: ["notion:good-websites"],
    paths: ["/sites", "/api/sites"],
    pagePaths: [],
  },
};

/**
 * Invalidate Upstash + Next.js caches for one content type.
 * Used by `/api/purge-cache` and every webhook that writes Notion.
 */
export async function purgeContentType(type: PurgeableContentType): Promise<number> {
  const config = PURGE_CONFIG[type];

  let deleted = 0;
  for (const pattern of config.patterns) {
    deleted += await invalidateNotionCache(pattern);
  }

  // Next 16 requires a cacheLife profile as the second arg; "max" gives
  // stale-while-revalidate behavior (serve existing cached data while
  // regenerating in the background).
  for (const tag of config.tags) {
    revalidateTag(tag, "max");
  }

  for (const path of config.paths) {
    revalidatePath(path);
  }
  for (const path of config.pagePaths) {
    revalidatePath(path, "page");
  }

  return deleted;
}
