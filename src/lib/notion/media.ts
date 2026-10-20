export type MediaKind = "image" | "video";

export type MediaFile = {
  type: "external" | "file";
  external?: { url: string };
  file?: { url: string; expiry_time: string };
  caption?: unknown[];
};

export type MediaView = {
  id: string;
  kind: MediaKind;
  file: MediaFile;
};

export type MediaBlockLike = {
  id: string;
  type: string;
  image?: MediaFile;
  video?: MediaFile;
};

export type MediaResult =
  | {
      kind: "image";
      success: true;
      originalUrl: string;
      newUrl: string;
      originalSize: number;
      optimizedSize: number;
      savings: number;
    }
  | {
      kind: "video";
      success: true;
      originalUrl: string;
      newUrl: string;
      size: number;
    }
  | {
      kind: MediaKind;
      success: false;
      error: string;
    };

export type MediaStats = {
  images: {
    total: number;
    successful: number;
    failed: number;
    originalSize: number;
    optimizedSize: number;
    savings: string;
  };
  videos: {
    total: number;
    successful: number;
    failed: number;
    totalSize: number;
  };
  total: number;
  successful: number;
  failed: number;
};

function isMediaKind(type: string): type is MediaKind {
  return type === "image" || type === "video";
}

/**
 * Flatten image and video blocks into one list, in document order.
 */
export function collectMedia(blocks: MediaBlockLike[]): MediaView[] {
  const media: MediaView[] = [];

  for (const block of blocks) {
    if (!isMediaKind(block.type)) continue;
    const file = block[block.type];
    if (!file) continue;
    media.push({ id: block.id, kind: block.type, file });
  }

  return media;
}

export function getMediaUrl(media: Pick<MediaView, "file">): string | null {
  if (media.file.type === "external" && media.file.external) {
    return media.file.external.url;
  }
  if (media.file.type === "file" && media.file.file) {
    return media.file.file.url;
  }
  return null;
}

export function mediaBlockUpdate(media: MediaView, r2Url: string) {
  return {
    block_id: media.id,
    [media.kind]: {
      external: { url: r2Url },
      caption: media.file.caption || [],
    },
  };
}

export function failedMediaResult(kind: MediaKind, error: string): MediaResult {
  return { kind, success: false, error };
}

export function summarizeMediaResults(results: MediaResult[]): MediaStats {
  const stats: MediaStats = {
    images: {
      total: 0,
      successful: 0,
      failed: 0,
      originalSize: 0,
      optimizedSize: 0,
      savings: "0%",
    },
    videos: {
      total: 0,
      successful: 0,
      failed: 0,
      totalSize: 0,
    },
    total: results.length,
    successful: 0,
    failed: 0,
  };

  for (const result of results) {
    if (result.kind === "image") {
      stats.images.total++;
      if (result.success) {
        stats.images.successful++;
        stats.successful++;
        stats.images.originalSize += result.originalSize;
        stats.images.optimizedSize += result.optimizedSize;
      } else {
        stats.images.failed++;
        stats.failed++;
      }
      continue;
    }

    stats.videos.total++;
    if (result.success) {
      stats.videos.successful++;
      stats.successful++;
      stats.videos.totalSize += result.size;
    } else {
      stats.videos.failed++;
      stats.failed++;
    }
  }

  const { originalSize, optimizedSize } = stats.images;
  stats.images.savings =
    originalSize > 0 ? `${((1 - optimizedSize / originalSize) * 100).toFixed(1)}%` : "0%";

  return stats;
}
