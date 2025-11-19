import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { getGoodWebsitesDatabaseItems } from "@/lib/notion";

export async function GET() {
  try {
    const items = await getGoodWebsitesDatabaseItems();
    return cachedResponse(items, 86400); // 24 hour cache
  } catch (error) {
    console.error("Error fetching good website items:", error);
    return errorResponse("Failed to fetch good website items");
  }
}
