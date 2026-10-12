import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { logger } from "@/lib/logger";
import { getSpeakingItems } from "@/lib/notion/queries";
import { withAxiom } from "@/lib/observability/axiom-route";

async function getHandler() {
  try {
    const items = await getSpeakingItems();

    return cachedResponse(items, 86400); // 24 hour cache
  } catch (error) {
    logger.error("Error fetching speaking items", error);
    return errorResponse("Failed to fetch speaking items");
  }
}

export const GET = withAxiom(getHandler, { name: "/api/speaking" });
