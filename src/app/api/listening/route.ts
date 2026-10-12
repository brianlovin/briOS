import { cachedResponse, errorResponse, parsePaginationParams } from "@/lib/api-utils";
import { logger } from "@/lib/logger";
import { getListeningHistoryDatabaseItems } from "@/lib/notion";
import { withAxiom } from "@/lib/observability/axiom-route";

async function getHandler(request: Request) {
  try {
    const { cursor, limit } = parsePaginationParams(request);
    const { items, nextCursor } = await getListeningHistoryDatabaseItems(cursor, limit);
    // Cache for 24 hours - Listening history updates infrequently
    return cachedResponse({ items, nextCursor }, 86400);
  } catch (error) {
    logger.error("Error fetching listening history", error);
    return errorResponse("Failed to fetch listening history");
  }
}

export const GET = withAxiom(getHandler, { name: "/api/listening" });
