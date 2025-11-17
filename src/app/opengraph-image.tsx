import { generateOGImage } from "@/lib/og-utils";

export const runtime = "nodejs";
export const alt = "Brian Lovin";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return generateOGImage({
    title: "Brian Lovin",
    url: "brianlovin.com",
  });
}
