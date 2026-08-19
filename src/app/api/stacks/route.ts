import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { getStackDatabaseItems } from "@/lib/notion";
import { filterStacks } from "@/lib/stack";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";
    const platform = searchParams.get("platform") || "";

    const items = await getStackDatabaseItems();
    const filteredItems = filterStacks(items, { status, platform });

    return cachedResponse(filteredItems, 86400); // 24 hour cache
  } catch (error) {
    console.error("Error fetching stack items:", error);
    return errorResponse("Failed to fetch stack items");
  }
}
