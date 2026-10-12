import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { logger } from "@/lib/logger";
import { getTilItemContent } from "@/lib/notion";
import { withAxiom } from "@/lib/observability/axiom-route";

async function getHandler(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  try {
    const item = await getTilItemContent(id);

    if (!item) {
      return errorResponse("TIL entry not found", 404);
    }

    return cachedResponse(item, 86400); // 24 hour cache
  } catch (error) {
    logger.error(`Error fetching TIL entry ${id}:`, error);
    return errorResponse("Failed to fetch TIL entry");
  }
}

export const GET = withAxiom(getHandler, { name: "/api/til/[id]" });
