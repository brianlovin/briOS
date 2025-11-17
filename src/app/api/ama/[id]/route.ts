import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { getAmaItemContent } from "@/lib/notion";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  try {
    const item = await getAmaItemContent(id);

    if (!item) {
      return errorResponse("Question not found", 404);
    }

    // Cache for 24 hours - Notion content doesn't change frequently
    return cachedResponse(item, 86400);
  } catch (error) {
    console.error(`Error fetching AMA question ${id}:`, error);
    return errorResponse("Failed to fetch question");
  }
}
