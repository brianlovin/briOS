import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-utils";
import { invalidateNotionCache } from "@/lib/notion";

const CONTENT_TYPES = ["writing", "til", "ama", "stack", "sites", "all"] as const;
type ContentType = (typeof CONTENT_TYPES)[number];

/** Redis key patterns, Next cache tags, and paths to revalidate per content type */
const PURGE_CONFIG: Record<
  Exclude<ContentType, "all">,
  { patterns: string[]; tags: string[]; paths: string[] }
> = {
  writing: {
    patterns: ["notion:writing:*"],
    tags: ["notion:writing"],
    paths: ["/writing", "/api/writing"],
  },
  til: {
    patterns: ["notion:til:*"],
    tags: ["notion:til"],
    paths: ["/til", "/api/til"],
  },
  ama: {
    patterns: ["notion:ama:*"],
    tags: ["notion:ama"],
    paths: ["/ama", "/api/ama"],
  },
  stack: {
    patterns: ["notion:stack:*"],
    tags: ["notion:stack"],
    paths: ["/stack", "/api/stacks"],
  },
  sites: {
    patterns: ["notion:good-websites:*"],
    tags: ["notion:good-websites"],
    paths: ["/sites", "/api/sites"],
  },
};

async function purgeCache(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const type = searchParams.get("type") || "all";

  if (!process.env.CACHE_PURGE_SECRET || secret !== process.env.CACHE_PURGE_SECRET) {
    return errorResponse("Unauthorized", 401);
  }

  if (!CONTENT_TYPES.includes(type as ContentType)) {
    return errorResponse(`Invalid type. Must be one of: ${CONTENT_TYPES.join(", ")}`, 400);
  }

  const types =
    type === "all" ? (["writing", "til", "ama", "stack", "sites"] as const) : ([type] as const);
  const results: Record<string, number> = {};

  for (const t of types) {
    const config = PURGE_CONFIG[t as Exclude<ContentType, "all">];

    let deleted = 0;
    for (const pattern of config.patterns) {
      deleted += await invalidateNotionCache(pattern);
    }
    results[t] = deleted;

    // Invalidate the Next.js data cache layer alongside the Upstash layer.
    // Next 16 requires a cacheLife profile as the second arg; "max" gives
    // stale-while-revalidate behavior (serve existing cached data while
    // regenerating in the background).
    for (const tag of config.tags) {
      revalidateTag(tag, "max");
    }

    for (const path of config.paths) {
      revalidatePath(path);
    }
  }

  console.log(`[Cache Purge] Purged type=${type}:`, results);

  return NextResponse.json({
    success: true,
    type,
    purged: results,
  });
}

/** GET for browser/curl, POST for Notion webhook buttons */
export const GET = purgeCache;
export const POST = purgeCache;
