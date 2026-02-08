import { getWritingPosts } from "@/db/queries/writing";
import { cachedResponse, errorResponse } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const { items, nextCursor } = await getWritingPosts(cursor, limit);
    return cachedResponse({ items, nextCursor }, 86400); // 24 hour cache
  } catch (error) {
    console.error("Error fetching writing posts:", error);
    return errorResponse("Failed to fetch writing posts");
  }
}
