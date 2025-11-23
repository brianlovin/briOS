import { allAppDissectionItems } from "@/data/app-dissection";
import { generateOGImage } from "@/lib/og-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = allAppDissectionItems.find((item) => item.slug === params.slug);

  if (!post) {
    // Fallback to generic title if post not found
    return generateOGImage({
      title: "App Dissection",
      url: "brianlovin.com/app-dissection",
    });
  }

  return generateOGImage({
    title: `App Dissection / ${post.title}`,
    url: `brianlovin.com/app-dissection/${params.slug}`,
  });
}
