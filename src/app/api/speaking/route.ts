import { getSpeakingEvents } from "@/db/queries/speaking";
import { cachedResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    const items = await getSpeakingEvents();

    return cachedResponse(items, 3600); // 1 hour cache
  } catch (error) {
    console.error("Error fetching speaking items:", error);
    return errorResponse("Failed to fetch speaking items");
  }
}
