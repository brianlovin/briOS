import { NextResponse } from "next/server";

import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { getRankedHNPosts } from "@/lib/hn";

export async function GET(): Promise<NextResponse> {
  try {
    const posts = await getRankedHNPosts();
    // Cache for 5 minutes - filtered high-signal posts from last 6 hours
    return cachedResponse(posts, 300);
  } catch (error) {
    console.error("Error fetching HN posts:", error);
    return errorResponse("Failed to fetch Hacker News posts");
  }
}
