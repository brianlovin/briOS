import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { getGoodWebsitesDatabaseItems } from "@/lib/notion";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag") || "";

    const items = await getGoodWebsitesDatabaseItems();

    // Filter items based on query parameters
    const filteredItems = items.filter((item) => {
      const tagMatch = tag ? item.tags?.includes(tag) : true;
      return tagMatch;
    });

    return cachedResponse(filteredItems, 86400); // 24 hour cache
  } catch (error) {
    console.error("Error fetching good website items:", error);
    return errorResponse("Failed to fetch good website items");
  }
}
