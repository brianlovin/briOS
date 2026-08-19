import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { filterGoodWebsites, GOOD_WEBSITES_SHUFFLE_INTERVAL_SECONDS } from "@/lib/goodWebsites";
import { getCachedShuffledGoodWebsites } from "@/lib/goodWebsites-cached";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag") || "";

    // Same 5-minute shuffle cache as /sites so a client fetch cannot
    // introduce a different permutation than first HTML.
    const items = await getCachedShuffledGoodWebsites();
    const filteredItems = filterGoodWebsites(items, { tag });

    return cachedResponse(filteredItems, GOOD_WEBSITES_SHUFFLE_INTERVAL_SECONDS);
  } catch (error) {
    console.error("Error fetching good website items:", error);
    return errorResponse("Failed to fetch good website items");
  }
}
