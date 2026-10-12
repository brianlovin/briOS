import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { logger } from "@/lib/logger";
import { getStackDatabaseItems } from "@/lib/notion";
import { withAxiom } from "@/lib/observability/axiom-route";
import { filterStacks } from "@/lib/stack";

async function getHandler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";
    const platform = searchParams.get("platform") || "";

    const items = await getStackDatabaseItems();
    const filteredItems = filterStacks(items, { status, platform });

    return cachedResponse(filteredItems, 86400); // 24 hour cache
  } catch (error) {
    logger.error("Error fetching stack items", error);
    return errorResponse("Failed to fetch stack items");
  }
}

export const GET = withAxiom(getHandler, { name: "/api/stacks" });
