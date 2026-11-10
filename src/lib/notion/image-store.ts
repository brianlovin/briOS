import { toErrorMessage } from "@/lib/axiom";
import { optimizeWritingImage } from "@/lib/image-processing/optimize";
import { logger } from "@/lib/logger";
import { missingR2EnvVars, r2ObjectExists, r2PublicUrl, uploadBufferToR2 } from "@/lib/r2/storage";

import { isPlaceholderNotionBuild } from "./cache";
import type { DownloadedFile, PersistImageDeps } from "./persist-images";

/*
 * Server implementation behind `#notion-image-store` (see package.json
 * "imports"). Client components reach `queries.ts` through the
 * `@/lib/notion` barrel, so sharp and the S3 SDK must not be in that graph;
 * browser bundles resolve `image-store.browser.ts` instead.
 */

async function downloadFile(url: string): Promise<DownloadedFile> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed with HTTP ${response.status}`);
  }
  return {
    body: Buffer.from(await response.arrayBuffer()),
    contentType: response.headers.get("content-type") || "application/octet-stream",
  };
}

/** Same compression as the writing-images webhook; GIF/SVG pass through untouched. */
async function optimizeFile(file: DownloadedFile): Promise<DownloadedFile> {
  if (!file.contentType.startsWith("image/")) return file;
  if (file.contentType === "image/gif" || file.contentType === "image/svg+xml") return file;
  try {
    const optimized = await optimizeWritingImage(file.body);
    if (optimized.optimizedSize >= file.body.length) return file;
    return { body: optimized.buffer, contentType: optimized.contentType };
  } catch (error) {
    logger.warn("[Notion images] Optimize failed, uploading original", {
      error_message: toErrorMessage(error),
    });
    return file;
  }
}

let warnedMissingR2 = false;

export const defaultPersistImageDeps: PersistImageDeps = {
  store: {
    exists: r2ObjectExists,
    put: (key, body, contentType) => uploadBufferToR2(body, contentType, key),
    publicUrl: r2PublicUrl,
  },
  download: downloadFile,
  optimize: optimizeFile,
  isEnabled() {
    if (isPlaceholderNotionBuild()) return false;
    const missing = missingR2EnvVars();
    if (missing.length === 0) return true;
    if (!warnedMissingR2) {
      warnedMissingR2 = true;
      logger.warn("[Notion images] R2 not configured; serving Notion URLs", { missing });
    }
    return false;
  },
};
