import { cachedResponse, errorResponse, parsePaginationParams } from "@/lib/api-utils";
import { getWritingDatabaseItems } from "@/lib/notion";

export async function GET(request: Request) {
  try {
    const { cursor, limit } = parsePaginationParams(request);
    const { items, nextCursor } = await getWritingDatabaseItems(cursor, limit);
    return cachedResponse({ items, nextCursor }, 86400); // 24 hour cache
  } catch (error) {
    console.error("Error fetching writing posts:", error);
    return errorResponse("Failed to fetch writing posts");
  }
}
