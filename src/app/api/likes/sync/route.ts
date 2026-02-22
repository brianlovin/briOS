import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-utils";
import { getAllLikeCounts } from "@/lib/likes-redis";
import { notion } from "@/lib/notion/client";

export async function GET(request: Request) {
  try {
    // Verify sync token
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token || token !== process.env.LIKES_SYNC_TOKEN) {
      return errorResponse("Unauthorized", 401);
    }

    // Get all like counts from Redis
    const likeCounts = await getAllLikeCounts();

    if (likeCounts.size === 0) {
      return NextResponse.json({ message: "No likes to sync", synced: 0 });
    }

    const errors: string[] = [];
    const entries = Array.from(likeCounts.entries());

    // Process in concurrent batches of 3 to respect Notion's ~3 req/sec rate limit
    const CONCURRENCY = 3;
    let synced = 0;

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
          synced++;
        } else {
          errors.push(value.pageId);
        }
      }
    }

    return NextResponse.json({
      message: "Likes synced to Notion",
      synced,
      total: likeCounts.size,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("[Likes Sync] Error syncing likes:", error);
    return errorResponse("Failed to sync likes");
  }
}
