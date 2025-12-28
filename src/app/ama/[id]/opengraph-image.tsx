import { getAmaItemContent } from "@/lib/notion";
import { generateOGImage, truncateOGTitle } from "@/lib/og-utils";

export const runtime = "nodejs";
export const revalidate = 86400; // 24 hours
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  try {
    const item = await getAmaItemContent(id);

    if (!item) {
      // Fallback to generic title if item not found
      return generateOGImage({
        title: "AMA",
        url: "brianlovin.com/ama",
      });
    }

    // Truncate long questions to fit within 3 lines
    const truncatedTitle = truncateOGTitle(item.title, 3);

    return generateOGImage({
      title: truncatedTitle,
      url: `brianlovin.com/ama/${id}`,
    });
  } catch {
    // Fallback on error
    return generateOGImage({
      title: "AMA",
      url: "brianlovin.com/ama",
    });
  }
}
