import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { getSpeakingItems } from "@/lib/notion/queries";

export async function GET() {
  try {
    const items = await getSpeakingItems();

    return cachedResponse(items, 86400); // 24 hour cache
  } catch (error) {
    console.error("Error fetching speaking items:", error);
    return errorResponse("Failed to fetch speaking items");
  }
}
