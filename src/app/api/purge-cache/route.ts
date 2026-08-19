import { NextResponse } from "next/server";

import { ingestActivityFromContentPurge } from "@/lib/activity-from-notion";
import { afterActivity } from "@/lib/activity-schedule";
import { errorResponse, safeCompare } from "@/lib/api-utils";
import {
  type NotionPurgeableContentType,
  PURGE_CACHE_TYPES,
  PURGEABLE_CONTENT_TYPES,
  type PurgeableContentType,
  type PurgeCacheType,
  purgeContentType,
} from "@/lib/notion/purge";

async function readNotionPageId(request: Request): Promise<string | undefined> {
  if (request.method !== "POST") return undefined;
  try {
    const body = (await request.json()) as { data?: { id?: unknown } };
    return typeof body.data?.id === "string" && body.data.id.length > 0 ? body.data.id : undefined;
  } catch {
    return undefined;
  }
}

async function purgeCache(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const type = searchParams.get("type") || "all";
  const pageId = await readNotionPageId(request);

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

  if (pageId && type !== "all" && type !== "hn") {
    afterActivity((store) =>
      ingestActivityFromContentPurge(type as NotionPurgeableContentType, pageId, store),
    );
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
