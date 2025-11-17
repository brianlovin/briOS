import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { getStackDatabaseItems } from "@/lib/notion";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";
    const platform = searchParams.get("platform") || "";

    const items = await getStackDatabaseItems();

    // Filter items based on query parameters
    const filteredItems = items.filter((item) => {
      const itemStatus = item.status?.toLowerCase() || "active";
      const statusMatch = status === "all" ? true : itemStatus === status;
      const platformMatch = platform ? item.platforms?.includes(platform) : true;
      return statusMatch && platformMatch;
    });

    return cachedResponse(filteredItems, 86400); // 24 hour cache
  } catch (error) {
    console.error("Error fetching stack items:", error);
    return errorResponse("Failed to fetch stack items");
  }
}
