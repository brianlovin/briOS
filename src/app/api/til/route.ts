import { getTilEntries } from "@/db/queries/til";
import { cachedResponse, errorResponse } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursorRaw = searchParams.get("cursor");
    const limitRaw = searchParams.get("limit");
    const cursor = cursorRaw ? Number.parseInt(cursorRaw, 10) : 0;
    const limit = limitRaw ? Number.parseInt(limitRaw, 10) : 20;

    if (!Number.isFinite(cursor) || cursor < 0) {
      return errorResponse("Invalid cursor", 400);
    }
    if (!Number.isFinite(limit) || limit <= 0 || limit > 100) {
      return errorResponse("Invalid limit", 400);
    }

    const { items, nextCursor } = await getTilEntries(String(cursor), limit);
    return cachedResponse({ items, nextCursor }, 3600); // 1 hour cache
  } catch (error) {
    console.error("Error fetching TIL entries:", error);
    return errorResponse("Failed to fetch TIL entries");
  }
}
