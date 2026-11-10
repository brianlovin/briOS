import { NextResponse } from "next/server";

import { errorResponse, safeCompare } from "@/lib/api-utils";
import { track } from "@/lib/axiom";
import { getAllLikeCounts } from "@/lib/likes-redis";
import { syncPageLikes } from "@/lib/likes-sync";
import { logger } from "@/lib/logger";
import { annotate, withAxiom } from "@/lib/observability/axiom-route";

async function getHandler(request: Request) {
  try {
    // Verify sync token
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!safeCompare(token, process.env.LIKES_SYNC_TOKEN)) {
      return errorResponse("Unauthorized", 401);
    }

    // Get all like counts from Redis
    const likeCounts = await getAllLikeCounts();

    if (likeCounts.size === 0) {
      return NextResponse.json({ message: "No likes to sync", synced: 0 });
    }

    const errors: string[] = [];
    const skipped: Record<string, string[]> = {};
    const entries = Array.from(likeCounts.entries());

    // Process in concurrent batches of 3 to respect Notion's ~3 req/sec rate limit
    const CONCURRENCY = 3;
    let synced = 0;
    let unchanged = 0;
    let skippedCount = 0;

    for (let i = 0; i < entries.length; i += CONCURRENCY) {
      const batch = entries.slice(i, i + CONCURRENCY);
      const results = await Promise.all(
        batch.map(async ([pageId, count]) => ({
          pageId,
          outcome: await syncPageLikes(pageId, count),
        })),
      );

      for (const { pageId, outcome } of results) {
        switch (outcome.status) {
          case "synced":
            synced++;
            break;
          case "unchanged":
            unchanged++;
            break;
          case "skipped":
            skippedCount++;
            (skipped[outcome.reason] ??= []).push(pageId);
            break;
          case "failed":
            logger.error("[Likes Sync] Failed to sync page", outcome.error, { page_id: pageId });
            errors.push(pageId);
            break;
        }
      }
    }

    if (skippedCount > 0) {
      logger.info("[Likes Sync] Skipped pages with nowhere to write Likes", { skipped });
    }

    const summary = {
      synced,
      unchanged,
      skipped: skippedCount,
      failed: errors.length,
      total: likeCounts.size,
    };
    track("likes.synced", summary);
    annotate(summary);

    return NextResponse.json({
      message: "Likes synced to Notion",
      ...summary,
      skipped: skippedCount > 0 ? skipped : undefined,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    logger.error("[Likes Sync] Error syncing likes", error);
    return errorResponse("Failed to sync likes");
  }
}

export const GET = withAxiom(getHandler, { name: "likes-sync", kind: "cron" });
