import { gateway } from "@ai-sdk/gateway";
import { generateText } from "ai";
import sharp from "sharp";

import { formatKeywords } from "./metadata";
import { STAMP_ONLY_PROMPT } from "./stamp-prompt";

export const STAMP_MODEL = "google/gemini-3.1-flash-image-preview";

export async function referencePhotoForStamp(photo: Buffer): Promise<{
  buffer: Buffer;
  mediaType: "image/jpeg";
}> {
  const buffer = await sharp(photo)
    .rotate()
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();

  return { buffer, mediaType: "image/jpeg" };
}

export async function generateStamp(photo: Buffer): Promise<{ image: Buffer; keywords: string }> {
  const reference = await referencePhotoForStamp(photo);

  const result = await generateText({
    model: gateway(STAMP_MODEL),
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: STAMP_ONLY_PROMPT },
          { type: "file", data: reference.buffer, mediaType: reference.mediaType },
        ],
      },
    ],
  });

  const file = result.files.find((item) => item.mediaType?.startsWith("image/"));
  if (!file) {
    throw new Error("Stamp model returned no image");
  }

  return {
    image: Buffer.from(file.uint8Array),
    keywords: formatKeywords(result.text),
  };
}
