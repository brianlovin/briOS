import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { filterGoodWebsites, getGoodWebsites, getGoodWebsitesSeed } from "@/lib/goodWebsites";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag") || "";

    // Use the same function as the page to get randomized results
    const items = await getGoodWebsites(getGoodWebsitesSeed());
    const filteredItems = filterGoodWebsites(items, { tag });

    // Cache for 5 minutes to match ISR revalidation
    return cachedResponse(filteredItems, 300);
  } catch (error) {
    console.error("Error fetching good website items:", error);
    return errorResponse("Failed to fetch good website items");
  }
}
