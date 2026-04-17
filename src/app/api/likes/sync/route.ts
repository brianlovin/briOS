import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-utils";
import {
  getAllLikeCounts,
  getBatchLikeCounts,
  getDirtyCount,
  getDirtyPageIds,
  markSynced,
} from "@/lib/likes-redis";
import { notion } from "@/lib/notion/client";

/** Max entries processed per invocation. Notion updates are 3-wide concurrent,
 * so 50 entries = ~17 sequential batches of 3 ≈ well under platform timeout. */
const SYNC_BATCH_MAX = 50;

/** Notion rate limit honors ~3 req/sec; keep existing concurrency. */
const CONCURRENCY = 3;

async function syncBatch(
  entries: Array<[string, number]>,
): Promise<{ synced: string[]; failed: string[] }> {
  const synced: string[] = [];
  const failed: string[] = [];

  for (let i = 0; i < entries.length; i += CONCURRENCY) {
    const batch = entries.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map(([pageId, count]) =>
        notion.pages
          .update({
            page_id: pageId,
            properties: {
              Likes: { number: count },
            } as Parameters<typeof notion.pages.update>[0]["properties"],
          })
          .then(() => ({ pageId, success: true as const }))
          .catch((error) => {
            console.error(`[Likes Sync] Failed to sync page ${pageId}:`, error);
            return { pageId, success: false as const };
          }),
      ),
    );

    for (const result of results) {
      const value =
        result.status === "fulfilled" ? result.value : { pageId: "unknown", success: false };
      if (value.success) {
        synced.push(value.pageId);
      } else if (value.pageId !== "unknown") {
        failed.push(value.pageId);
      }
    }
  }

  return { synced, failed };
}

/**
 * Legacy scan-all path. Runs when FORCE_FULL_SYNC=true is set in the env.
 * Used for the one-time seed after first deploying the dirty-tracking change,
 * and as an emergency rollback path.
 */
async function runFullSync(): Promise<NextResponse> {
  const likeCounts = await getAllLikeCounts();

  if (likeCounts.size === 0) {
    return NextResponse.json({ mode: "full", synced: 0, total: 0 });
  }

  const entries = Array.from(likeCounts.entries());
  const { synced, failed } = await syncBatch(entries);

  // Clear successfully-synced entries from the dirty set so the incremental
  // path has a clean starting point.
  if (synced.length > 0) {
    await markSynced(synced);
  }

  return NextResponse.json({
    mode: "full",
    synced: synced.length,
    failed: failed.length,
    total: likeCounts.size,
    errors: failed.length > 0 ? failed : undefined,
  });
}

/**
 * Incremental sync path. Reads up to SYNC_BATCH_MAX pageIds from the dirty
 * set, syncs their counts to Notion, and marks successful updates clean.
 * Caller can re-invoke if `remainingDirty > 0`.
 */
async function runIncrementalSync(): Promise<NextResponse> {
  const dirtyIds = await getDirtyPageIds(SYNC_BATCH_MAX);

  if (dirtyIds.length === 0) {
    const remainingDirty = await getDirtyCount();
    return NextResponse.json({
      mode: "incremental",
      synced: 0,
      failed: 0,
      remainingDirty,
    });
  }

  const countsMap = await getBatchLikeCounts(dirtyIds);
  const entries: Array<[string, number]> = dirtyIds.map((id) => [id, countsMap.get(id) ?? 0]);

  const { synced, failed } = await syncBatch(entries);

  if (synced.length > 0) {
    await markSynced(synced);
  }

  const remainingDirty = await getDirtyCount();

  return NextResponse.json({
    mode: "incremental",
    synced: synced.length,
    failed: failed.length,
    remainingDirty,
    errors: failed.length > 0 ? failed : undefined,
  });
}

export async function GET(request: Request) {
  try {
    // Verify sync token
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token || token !== process.env.LIKES_SYNC_TOKEN) {
      return errorResponse("Unauthorized", 401);
    }

    if (process.env.FORCE_FULL_SYNC === "true") {
      return runFullSync();
    }

    return runIncrementalSync();
  } catch (error) {
    console.error("[Likes Sync] Error syncing likes:", error);
    return errorResponse("Failed to sync likes");
  }
}
