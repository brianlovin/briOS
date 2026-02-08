import { getTilEntryById } from "@/db/queries/til";
import { cachedResponse, errorResponse } from "@/lib/api-utils";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  try {
    const item = await getTilEntryById(id);

    if (!item) {
      return errorResponse("TIL entry not found", 404);
    }

    return cachedResponse(item, 86400); // 24 hour cache
  } catch (error) {
    console.error(`Error fetching TIL entry ${id}:`, error);
    return errorResponse("Failed to fetch TIL entry");
  }
}
