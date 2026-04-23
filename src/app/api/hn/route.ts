import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";

import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { HN_BOTID_ADVANCED_OPTIONS } from "@/lib/botid";
import { getRankedHNPosts } from "@/lib/hn";

export async function GET(): Promise<NextResponse> {
  try {
    const verification = await checkBotId({
      advancedOptions: HN_BOTID_ADVANCED_OPTIONS,
    });

    if (verification.isBot) {
      return errorResponse("Access denied", 403);
    }

    const posts = await getRankedHNPosts();
    // Cache for 1 hour - filtered high-signal posts from last 24 hours
    return cachedResponse(posts, 3600);
  } catch (error) {
    console.error("Error fetching HN posts:", error);
    return errorResponse("Failed to fetch Hacker News posts");
  }
}
