import { getPostById } from "@/lib/hn";
import { generateOGImage } from "@/lib/og-utils";
import { stripHtmlTags } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  try {
    const post = await getPostById(id, false);

    if (!post) {
      // Fallback to generic title if post not found
      return generateOGImage({
        title: "Hacker News",
        url: "brianlovin.com/hn",
      });
    }

    // Extract text from title (remove HTML if any)
    const cleanTitle = post.title ? stripHtmlTags(post.title) : "Hacker News Post";

    return generateOGImage({
      title: cleanTitle,
      url: `brianlovin.com/hn/${id}`,
    });
  } catch {
    // Fallback on error
    return generateOGImage({
      title: "Hacker News",
      url: "brianlovin.com/hn",
    });
  }
}
