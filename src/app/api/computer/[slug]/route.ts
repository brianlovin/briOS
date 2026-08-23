import { cachedResponse, errorResponse } from "@/lib/api-utils";
import { resolveComputerTipFromSlug } from "@/lib/computer";

export async function GET(_request: Request, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  try {
    const item = await resolveComputerTipFromSlug(slug);

    if (!item) {
      return errorResponse("Tip not found", 404);
    }

    return cachedResponse(item, 86400);
  } catch (error) {
    console.error(`Error fetching computer tip ${slug}:`, error);
    return errorResponse("Failed to fetch tip");
  }
}
