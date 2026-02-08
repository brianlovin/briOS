import { getTilEntries } from "@/db/queries/til";
import { cachedResponse, errorResponse } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const { items, nextCursor } = await getTilEntries(cursor, limit);
    return cachedResponse({ items, nextCursor }, 86400); // 24 hour cache
  } catch (error) {
    console.error("Error fetching TIL entries:", error);
    return errorResponse("Failed to fetch TIL entries");
  }
}
