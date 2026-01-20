import sharp from "sharp";

interface OptimizeImageOptions {
  maxSize?: number; // Maximum width or height in pixels
  quality?: number; // Quality setting (1-100)
}

interface OptimizedImage {
  buffer: Buffer;
  format: string;
  contentType: string;
  width: number;
  height: number;
  originalSize: number;
  optimizedSize: number;
  savings: number; // Percentage saved
}

/**
 * Optimize an image buffer by resizing and compressing
 * Default: max 80x80px, quality 90
 */
export async function optimizeImage(
  buffer: Buffer,
  options: OptimizeImageOptions = {},
): Promise<OptimizedImage> {
  const { maxSize = 80, quality = 90 } = options;

  const image = sharp(buffer);
  const metadata = await image.metadata();

  // Resize if needed (maintain aspect ratio)
  let processedImage = image.resize(maxSize, maxSize, {
    fit: "inside",
    withoutEnlargement: true,
  });

  // Optimize based on format
  if (metadata.format === "png") {
    processedImage = processedImage.png({
      quality,
      compressionLevel: 9,
      effort: 10,
    });
  } else if (metadata.format === "jpeg" || metadata.format === "jpg") {
    processedImage = processedImage.jpeg({
      quality,
      mozjpeg: true,
    });
  } else if (metadata.format === "webp") {
    processedImage = processedImage.webp({
      quality,
      effort: 6,
    });
  } else if (metadata.format === "svg") {
    // SVGs are already vector, return as-is
    const optimizedMetadata = await image.metadata();
    return {
      buffer,
      format: "svg",
      contentType: "image/svg+xml",
      width: optimizedMetadata.width || 0,
      height: optimizedMetadata.height || 0,
      originalSize: buffer.length,
      optimizedSize: buffer.length,
      savings: 0,
    };
  }

  const optimizedBuffer = await processedImage.toBuffer();
  const optimizedMetadata = await sharp(optimizedBuffer).metadata();

  const savings = buffer.length > 0 ? (1 - optimizedBuffer.length / buffer.length) * 100 : 0;

  const format = metadata.format || "png";
  const contentType = `image/${format}`;

  return {
    buffer: optimizedBuffer,
    format,
    contentType,
    width: optimizedMetadata.width || 0,
    height: optimizedMetadata.height || 0,
    originalSize: buffer.length,
    optimizedSize: optimizedBuffer.length,
    savings,
  };
}

/**
 * Optimize an image for site icons (80x80px max)
 */
export async function optimizeSiteIcon(buffer: Buffer): Promise<OptimizedImage> {
  return optimizeImage(buffer, { maxSize: 80, quality: 90 });
}

/**
 * Optimize an image for blog posts (keep original size, high quality compression)
 */
export async function optimizeWritingImage(buffer: Buffer): Promise<OptimizedImage> {
  // Use a very large maxSize to prevent resizing, only compress
  return optimizeImage(buffer, { maxSize: 4000, quality: 90 });
}

/**
 * Optimize a screenshot for site previews
 * Converts to WebP at 1200x630 (OG image aspect ratio) for optimal display
 */
export async function optimizeSitePreview(buffer: Buffer): Promise<OptimizedImage> {
  const image = sharp(buffer);

  // Resize to preview dimensions, cropping from top
  // 1200x630 is the standard OG image ratio (1.91:1)
  const processedImage = image
    .resize(1200, 630, {
      fit: "cover",
      position: "top", // Crop from top to keep the header/hero visible
    })
    .webp({
      quality: 85,
      effort: 6,
    });

  const optimizedBuffer = await processedImage.toBuffer();
  const optimizedMetadata = await sharp(optimizedBuffer).metadata();

  const savings = buffer.length > 0 ? (1 - optimizedBuffer.length / buffer.length) * 100 : 0;

  return {
    buffer: optimizedBuffer,
    format: "webp",
    contentType: "image/webp",
    width: optimizedMetadata.width || 1200,
    height: optimizedMetadata.height || 630,
    originalSize: buffer.length,
    optimizedSize: optimizedBuffer.length,
    savings,
  };
}
