import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { computerTipLink, publicComputerTips } from "@/lib/computer";
import { getComputerDatabaseItems } from "@/lib/notion";

export async function GET() {
  try {
    const items = publicComputerTips(await getComputerDatabaseItems()).map((item) => ({
      ...item,
      href: computerTipLink(item)?.href,
    }));
    return cachedResponse({ items }, 86400);
  } catch (error) {
    console.error("Error fetching computer tips:", error);
    return errorResponse("Failed to fetch computer tips");
  }
}
