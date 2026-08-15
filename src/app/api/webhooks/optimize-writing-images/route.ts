import { NextResponse } from "next/server";

import { errorResponse, safeCompare } from "@/lib/api-utils";
import { optimizeWritingImage } from "@/lib/image-processing/optimize";
import { notion } from "@/lib/notion";
import { purgeContentType } from "@/lib/notion/purge";
import { uploadBufferToR2 } from "@/lib/r2/storage";

import {
  collectMedia,
  failedMediaResult,
  getMediaUrl,
  mediaBlockUpdate,
  type MediaResult,
  type MediaView,
  summarizeMediaResults,
} from "./media";

/**
 * Webhook endpoint to optimize writing page media and upload to R2
 *
 * POST /api/webhooks/optimize-writing-images
 * Notion automation payload: { data: { id } }
 *
 * Flow:
 * 1. Extract page ID from Notion webhook
 * 2. Fetch all blocks from the page (recursively)
 * 3. Collect image and video blocks into one media list
 * 4. For each item, download, optimize when the kind requires it, upload to R2,
 *    and update the Notion block
 */

interface BlockWithChildren {
  id: string;
  type: string;
  has_children: boolean;
  [key: string]: any;
}

/**
 * Recursively fetch all blocks from a page, including nested blocks
 */
async function getAllBlocks(blockId: string): Promise<BlockWithChildren[]> {
  const blocks: BlockWithChildren[] = [];

  try {
    let cursor: string | undefined;
    do {
      const response: any = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100,
      });

      for (const block of response.results) {
        blocks.push(block);

        // If block has children, recursively fetch them
        if (block.has_children) {
          const children = await getAllBlocks(block.id);
          blocks.push(...children);
        }
      }

      cursor = response.next_cursor || undefined;
    } while (cursor);
  } catch (error) {
    console.error(`Error fetching blocks for ${blockId}:`, error);
  }

  return blocks;
}

/**
 * Download, optimize (images only), upload, and rewrite one media block.
 * Kind is the only branch: images are compressed, videos are re-hosted as-is.
 */
async function optimizeMediaBlock(media: MediaView): Promise<MediaResult> {
  try {
    const sourceUrl = getMediaUrl(media);
    if (!sourceUrl) {
      return failedMediaResult(media.kind, `No ${media.kind} URL found`);
    }

    console.log(`  📥 Downloading ${media.kind}: ${sourceUrl.substring(0, 80)}...`);

    const response = await fetch(sourceUrl);
    if (!response.ok) {
      return failedMediaResult(media.kind, `Failed to download ${media.kind}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    let r2Url: string;
    let result: MediaResult;

    if (media.kind === "image") {
      console.log(`  🔧 Optimizing image (${(buffer.length / 1024).toFixed(2)}KB)...`);
      const optimized = await optimizeWritingImage(buffer);
      console.log(
        `  ✨ Optimized: ${optimized.width}x${optimized.height}, ${(optimized.optimizedSize / 1024).toFixed(2)}KB (saved ${optimized.savings.toFixed(1)}%)`,
      );
      console.log(`  📤 Uploading to R2...`);
      r2Url = await uploadBufferToR2(optimized.buffer, optimized.contentType);
      result = {
        kind: "image",
        success: true,
        originalUrl: sourceUrl,
        newUrl: r2Url,
        originalSize: optimized.originalSize,
        optimizedSize: optimized.optimizedSize,
        savings: optimized.savings,
      };
    } else {
      const contentType = response.headers.get("content-type") || "video/mp4";
      console.log(`  📤 Uploading video to R2 (${(buffer.length / 1024 / 1024).toFixed(2)}MB)...`);
      r2Url = await uploadBufferToR2(buffer, contentType);
      result = {
        kind: "video",
        success: true,
        originalUrl: sourceUrl,
        newUrl: r2Url,
        size: buffer.length,
      };
    }

    console.log(`  💾 Updating block...`);
    await notion.blocks.update(mediaBlockUpdate(media, r2Url) as any);

    return result;
  } catch (error) {
    console.error(`  ❌ Error optimizing ${media.kind} block:`, error);
    return failedMediaResult(media.kind, error instanceof Error ? error.message : "Unknown error");
  }
}

export async function POST(request: Request) {
  try {
    // Verify webhook secret
    const webhookSecret = process.env.NOTION_WEBHOOK_VERIFICATION_SECRET;
    const providedSecret = request.headers.get("x-webhook-secret");
    if (!safeCompare(providedSecret, webhookSecret)) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();

    // Extract page ID from Notion webhook payload
    const pageId = body.data?.id;

    // Validate required fields
    if (!pageId) {
      console.error("Missing required field: data.id (pageId)", body);
      return errorResponse("Missing required field: data.id (pageId)", 400);
    }

    console.log(`\n🚀 Starting media optimization for page ${pageId}\n`);

    // Step 1: Fetch all blocks from the page
    console.log("📚 Fetching all blocks...");
    const allBlocks = await getAllBlocks(pageId);
    console.log(`Found ${allBlocks.length} total blocks\n`);

    // Step 2: Collect image and video blocks into one media list
    const media = collectMedia(allBlocks);
    const imageCount = media.filter((item) => item.kind === "image").length;
    const videoCount = media.length - imageCount;
    console.log(`Found ${imageCount} image blocks, ${videoCount} video blocks\n`);

    if (media.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No images or videos found in the page",
          imagesProcessed: 0,
          videosProcessed: 0,
        },
        { status: 200 },
      );
    }

    // Step 3: Walk, optimize, and count through one list
    const results: MediaResult[] = [];

    for (let i = 0; i < media.length; i++) {
      const item = media[i];
      console.log(`Processing ${item.kind} ${i + 1}/${media.length}:`);

      const result = await optimizeMediaBlock(item);
      results.push(result);

      if (result.success) {
        console.log(`  ✅ Success\n`);
      } else {
        console.log(`  ❌ Error: ${result.error}\n`);
      }
    }

    const stats = summarizeMediaResults(results);

    // Same writing purge as /api/purge-cache (widens Redis from content:* to writing:*)
    await purgeContentType("writing");

    console.log("=".repeat(50));
    console.log(`✅ Optimization complete!`);
    console.log(
      `   - Images: ${stats.images.successful} successful, ${stats.images.failed} failed`,
    );
    console.log(
      `   - Videos: ${stats.videos.successful} successful, ${stats.videos.failed} failed`,
    );
    console.log(
      `   - Image original size: ${(stats.images.originalSize / 1024 / 1024).toFixed(2)}MB`,
    );
    console.log(
      `   - Image optimized size: ${(stats.images.optimizedSize / 1024 / 1024).toFixed(2)}MB`,
    );
    console.log(`   - Image savings: ${stats.images.savings}`);
    console.log(`   - Video size uploaded: ${(stats.videos.totalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log("=".repeat(50) + "\n");

    return NextResponse.json(
      {
        success: true,
        message: "Writing media optimized and uploaded to R2 successfully",
        stats,
        results,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error optimizing writing images", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(`Failed to optimize writing images: ${errorMessage}`, 500, error);
  }
}
