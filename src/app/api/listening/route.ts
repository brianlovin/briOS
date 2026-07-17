import { cachedResponse, errorResponse, parsePaginationParams } from "@/lib/api-utils";
import { getListeningHistoryDatabaseItems } from "@/lib/notion";

export async function GET(request: Request) {
  try {
    const { cursor, limit } = parsePaginationParams(request);
    const { items, nextCursor } = await getListeningHistoryDatabaseItems(cursor, limit);
    // Cache for 24 hours - Listening history updates infrequently
    return cachedResponse({ items, nextCursor }, 86400);
  } catch (error) {
    console.error("Error fetching listening history:", error);
    return errorResponse("Failed to fetch listening history");
  }
}
