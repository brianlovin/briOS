import { cachedResponse, errorResponse, parsePaginationParams } from "@/lib/api-utils";
import { logger } from "@/lib/logger";
import { getWritingDatabaseItems } from "@/lib/notion";
import { withAxiom } from "@/lib/observability/axiom-route";

async function getHandler(request: Request) {
  try {
    const { cursor, limit } = parsePaginationParams(request);
    const { items, nextCursor } = await getWritingDatabaseItems(cursor, limit);
    return cachedResponse({ items, nextCursor }, 86400); // 24 hour cache
  } catch (error) {
    logger.error("Error fetching writing posts", error);
    return errorResponse("Failed to fetch writing posts");
  }
}

export const GET = withAxiom(getHandler, { name: "/api/writing" });
