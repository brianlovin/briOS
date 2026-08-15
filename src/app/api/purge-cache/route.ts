import { NextResponse } from "next/server";

import { errorResponse, safeCompare } from "@/lib/api-utils";
import {
  PURGE_CACHE_TYPES,
  PURGEABLE_CONTENT_TYPES,
  type PurgeableContentType,
  type PurgeCacheType,
  purgeContentType,
} from "@/lib/notion/purge";

async function purgeCache(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const type = searchParams.get("type") || "all";

  if (!safeCompare(secret, process.env.CACHE_PURGE_SECRET)) {
    return errorResponse("Unauthorized", 401);
  }

  if (!PURGE_CACHE_TYPES.includes(type as PurgeCacheType)) {
    return errorResponse(`Invalid type. Must be one of: ${PURGE_CACHE_TYPES.join(", ")}`, 400);
  }

  const types: readonly PurgeableContentType[] =
    type === "all" ? PURGEABLE_CONTENT_TYPES : [type as PurgeableContentType];
  const results: Record<string, number> = {};

  for (const t of types) {
    results[t] = await purgeContentType(t);
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
