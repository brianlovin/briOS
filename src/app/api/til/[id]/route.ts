import { getTilEntryById } from "@/db/queries/til";
import { cachedResponse, errorResponse } from "@/lib/api-utils";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  try {
    if (!isUuid(id)) {
      return errorResponse("Invalid id", 400);
    }
    const item = await getTilEntryById(id);

    if (!item) {
      return errorResponse("TIL entry not found", 404);
    }

    return cachedResponse(item, 3600); // 1 hour cache
  } catch (error) {
    console.error(`Error fetching TIL entry ${id}:`, error);
    return errorResponse("Failed to fetch TIL entry");
  }
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
