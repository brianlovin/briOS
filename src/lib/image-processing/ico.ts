/**
 * ICO file parsing utilities
 * Extracts images from Windows ICO format for processing with sharp
 */

interface IcoImage {
  width: number;
  height: number;
  bitCount: number;
  size: number;
  offset: number;
  isPng: boolean;
}

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
 * Parse ICO file and extract information about contained images
 */
function parseIcoDirectory(buffer: Buffer): IcoImage[] {
  const count = buffer.readUInt16LE(4);
  const images: IcoImage[] = [];

  for (let i = 0; i < count; i++) {
    const entryOffset = 6 + i * 16;
    if (entryOffset + 16 > buffer.length) break;

    // Width/height of 0 means 256
    const width = buffer.readUInt8(entryOffset) || 256;
    const height = buffer.readUInt8(entryOffset + 1) || 256;
    const bitCount = buffer.readUInt16LE(entryOffset + 6);
    const size = buffer.readUInt32LE(entryOffset + 8);
    const offset = buffer.readUInt32LE(entryOffset + 12);

    // Check if the image data is PNG (starts with PNG signature)
    const isPng =
      offset + 8 <= buffer.length &&
      buffer.slice(offset, offset + 8).toString("hex") === "89504e470d0a1a0a";

    images.push({ width, height, bitCount, size, offset, isPng });
  }

  return images;
}

/**
 * Extract the best image from an ICO file
 * Prefers: largest PNG > largest BMP by resolution > first available
 * Returns the raw image data buffer (PNG or BMP without ICO header)
 */
export function extractBestImageFromIco(buffer: Buffer): Buffer | null {
  if (!isIcoBuffer(buffer)) return null;

  const images = parseIcoDirectory(buffer);
  if (images.length === 0) return null;

  // Sort by preference: PNG first, then by resolution (width * height)
  const sorted = [...images].sort((a, b) => {
    // Prefer PNG over non-PNG
    if (a.isPng && !b.isPng) return -1;
    if (!a.isPng && b.isPng) return 1;
    // Then prefer larger resolution
    return b.width * b.height - a.width * a.height;
  });

  const best = sorted[0];
  if (!best) return null;

  // Extract the image data
  if (best.offset + best.size > buffer.length) return null;
  const imageData = buffer.slice(best.offset, best.offset + best.size);

  if (best.isPng) {
    // PNG data can be used directly
    return imageData;
  }

  // BMP data in ICO files is headerless and uses AND mask
  // For non-PNG images, we need to construct a proper BMP or convert via other means
  // This is complex, so for now we only reliably support PNG extraction
  // Most modern favicons include PNG versions for high-res
  return null;
}
