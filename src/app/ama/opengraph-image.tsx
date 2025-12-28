import { generateOGImage } from "@/lib/og-utils";

export const runtime = "nodejs";
export const revalidate = 86400; // 24 hours
export const alt = "AMA - Brian Lovin";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return generateOGImage({
    title: "AMA",
    url: "brianlovin.com/ama",
  });
}
