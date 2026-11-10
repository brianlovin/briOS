import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";

import { logger } from "@/lib/logger";

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

export const R2_ENV_VARS = [
  "R2_S3_API_URL",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_PUBLIC_URL",
] as const;

export function missingR2EnvVars(env: Record<string, string | undefined> = process.env): string[] {
  return R2_ENV_VARS.filter((name) => !env[name]);
}

export function r2PublicUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`;
}

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
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/quicktime": ".mov",
  };

  return extensions[contentType] || ".bin";
}

/** True when `key` is already in the bucket; false on 404. Other errors throw. */
export async function r2ObjectExists(key: string): Promise<boolean> {
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
    return true;
  } catch (error) {
    const status = (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
    if (status === 404 || (error as { name?: string }).name === "NotFound") return false;
    throw error;
  }
}

/**
 * Uploads an image buffer directly to R2 storage
 * Returns the public R2 URL
 *
 * Without `key`, the object is named by content hash under `notion-images/`.
 */
export async function uploadBufferToR2(
  buffer: ArrayBuffer | Buffer,
  contentType: string,
  key?: string,
): Promise<string> {
  try {
    // Convert to Buffer if needed
    const bufferData = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

    // Generate a unique filename based on content hash
    const hash = crypto.createHash("sha256").update(bufferData).digest("hex");
    const extension = getExtensionFromContentType(contentType);
    const filename = key ?? `notion-images/${hash}${extension}`;

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

    const r2Url = r2PublicUrl(filename);

    console.log(`Uploaded to R2: ${filename}`);

    return r2Url;
  } catch (error) {
    logger.error("Error uploading buffer to R2", error);
    throw error;
  }
}
