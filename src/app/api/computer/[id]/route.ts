import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { getComputerItemContent } from "@/lib/notion";

export async function GET(_request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  try {
    const item = await getComputerItemContent(id);

    if (!item) {
      return errorResponse("Tip not found", 404);
    }

    return cachedResponse(item, 86400);
  } catch (error) {
    console.error(`Error fetching computer tip ${id}:`, error);
    return errorResponse("Failed to fetch tip");
  }
}
