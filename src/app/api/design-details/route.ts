import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { getDesignDetailsEpisodeDatabaseItems } from "@/lib/notion";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const { items, nextCursor } = await getDesignDetailsEpisodeDatabaseItems(cursor, limit);
    return cachedResponse({ items, nextCursor }, 86400); // 24 hour cache
  } catch (error) {
    console.error("Error fetching design details episodes:", error);
    return errorResponse("Failed to fetch design details episodes");
  }
}
