import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_S3_API_URL,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
// R2 public URL - using R2.dev subdomain for public access
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

function getExtensionFromContentType(contentType: string): string {
  const extensions: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
    "image/x-icon": ".ico",
    "image/vnd.microsoft.icon": ".ico",
  };

  return extensions[contentType] || ".jpg";
}

/**
 * Uploads an image buffer directly to R2 storage
 * Returns the public R2 URL
 */
export async function uploadBufferToR2(
  buffer: ArrayBuffer | Buffer,
  contentType: string,
): Promise<string> {
  try {
    // Convert to Buffer if needed
    const bufferData = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

    // Generate a unique filename based on content hash
    const hash = crypto.createHash("sha256").update(bufferData).digest("hex");
    const extension = getExtensionFromContentType(contentType);
    const filename = `notion-images/${hash}${extension}`;

    // Upload to R2
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: bufferData,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable", // Cache for 1 year
      }),
    );

    const r2Url = `${R2_PUBLIC_URL}/${filename}`;

    console.log(`Uploaded image to R2: ${filename}`);

    return r2Url;
  } catch (error) {
    console.error("Error uploading buffer to R2:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    throw error;
  }
}
