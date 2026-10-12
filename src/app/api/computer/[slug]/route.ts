import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { resolveComputerTipFromSlug } from "@/lib/computer";
import { logger } from "@/lib/logger";
import { withAxiom } from "@/lib/observability/axiom-route";

async function getHandler(_request: Request, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  try {
    const item = await resolveComputerTipFromSlug(slug);

    if (!item) {
      return errorResponse("Tip not found", 404);
    }

    return cachedResponse(item, 86400);
  } catch (error) {
    logger.error(`Error fetching computer tip ${slug}:`, error);
    return errorResponse("Failed to fetch tip");
  }
}

export const GET = withAxiom(getHandler, { name: "/api/computer/[slug]" });
