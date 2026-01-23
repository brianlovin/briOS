import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-utils";
import { getAllLikeCounts } from "@/lib/likes-redis";
import { notion } from "@/lib/notion/client";

// Notion API rate limit is ~3 requests/second, so we add a delay between calls
const NOTION_API_DELAY_MS = 350;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

    let synced = 0;
    const errors: string[] = [];

    // Update each page in Notion with rate limiting
    for (const [pageId, count] of likeCounts) {
      try {
        await notion.pages.update({
          page_id: pageId,
          properties: {
            Likes: { number: count },
          } as Parameters<typeof notion.pages.update>[0]["properties"],
        });
        synced++;
        // Add delay to respect Notion's rate limit
        await delay(NOTION_API_DELAY_MS);
      } catch (error) {
        console.error(`[Likes Sync] Failed to sync page ${pageId}:`, error);
        errors.push(pageId);
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
