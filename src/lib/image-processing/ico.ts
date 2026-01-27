/**
 * ICO file parsing utilities
 * Extracts images from Windows ICO format for processing with sharp
 */

import decodeIco from "decode-ico";
import sharp from "sharp";

/**
 * Check if a buffer is an ICO file
 * ICO files start with: 00 00 01 00 (reserved=0, type=1 for icon)
 */
export function isIcoBuffer(buffer: Buffer): boolean {
  if (buffer.length < 6) return false;
  const reserved = buffer.readUInt16LE(0);
  const type = buffer.readUInt16LE(2);
  return reserved === 0 && type === 1;
}

/**
 * Extract the best image from an ICO file as a PNG buffer
 * Uses decode-ico to parse ICO files with both PNG and BMP image data
 * Prefers: largest PNG > largest BMP by resolution
 */
export async function extractBestImageFromIco(buffer: Buffer): Promise<Buffer | null> {
  if (!isIcoBuffer(buffer)) return null;

  try {
    const images = decodeIco(buffer);
    if (images.length === 0) return null;

    // Sort by preference: PNG first, then by resolution (width * height)
    const sorted = [...images].sort((a, b) => {
      // Prefer PNG over BMP
      if (a.type === "png" && b.type !== "png") return -1;
      if (a.type !== "png" && b.type === "png") return 1;
      // Then prefer larger resolution
      return b.width * b.height - a.width * a.height;
    });

    const best = sorted[0];
    if (!best) return null;

    if (best.type === "png") {
      // PNG data can be used directly
      return Buffer.from(best.data);
    }

    // BMP type: decode-ico provides raw RGBA data, convert to PNG
    const pngBuffer = await sharp(Buffer.from(best.data), {
      raw: {
        width: best.width,
        height: best.height,
        channels: 4,
      },
    })
      .png()
      .toBuffer();

    return pngBuffer;
  } catch {
    return null;
  }
}
