import { getAmaQuestionById } from "@/db/queries/ama";
import { cachedResponse, errorResponse } from "@/lib/api-utils";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  try {
    const item = await getAmaQuestionById(id);

    if (!item) {
      return errorResponse("Question not found", 404);
    }

    return cachedResponse(item, 3600);
  } catch (error) {
    console.error(`Error fetching AMA question ${id}:`, error);
    return errorResponse("Failed to fetch question");
  }
}
