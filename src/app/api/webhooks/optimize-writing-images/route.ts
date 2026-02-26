import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-utils";
import { optimizeWritingImage } from "@/lib/image-processing/optimize";
import { invalidateNotionCache, notion } from "@/lib/notion";
import { uploadBufferToR2 } from "@/lib/r2/storage";

/**
 * Webhook endpoint to optimize all images in a blog post and upload to R2
 *
 * POST /api/webhooks/optimize-writing-images
 * Notion automation payload: { data: { id } }
 *
 * Flow:
 * 1. Extract page ID from Notion webhook
 * 2. Fetch all blocks from the page (recursively)
 * 3. Find all image blocks
 * 4. For each image:
 *    - Download the image
 *    - Optimize (compress at high quality, keep original dimensions)
 *    - Upload to R2
 *    - Update the block with R2 URL
 */

interface ImageBlock {
  id: string;
  type: "image";
  image: {
    type: "external" | "file";
    external?: { url: string };
    file?: { url: string; expiry_time: string };
    caption?: Array<any>;
  };
}

interface VideoBlock {
  id: string;
  type: "video";
  video: {
    type: "external" | "file";
    external?: { url: string };
    file?: { url: string; expiry_time: string };
    caption?: Array<any>;
  };
}

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
 * Extract image URL from a block
 */
function getImageUrl(block: ImageBlock): string | null {
  if (block.image.type === "external" && block.image.external) {
    return block.image.external.url;
  } else if (block.image.type === "file" && block.image.file) {
    return block.image.file.url;
  }
  return null;
}

/**
 * Optimize a single image block
 */
async function optimizeImageBlock(block: ImageBlock): Promise<{
  success: boolean;
  originalUrl?: string;
  newUrl?: string;
  originalSize?: number;
  optimizedSize?: number;
  savings?: number;
  error?: string;
}> {
  try {
    const imageUrl = getImageUrl(block);
    if (!imageUrl) {
      return { success: false, error: "No image URL found" };
    }

    console.log(`  📥 Downloading image: ${imageUrl.substring(0, 80)}...`);

    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return { success: false, error: "Failed to download image" };
    }

    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);

    console.log(`  🔧 Optimizing image (${(imageBuffer.length / 1024).toFixed(2)}KB)...`);

    // Optimize the image (compress, keep original dimensions)
    const optimized = await optimizeWritingImage(imageBuffer);

    console.log(
      `  ✨ Optimized: ${optimized.width}x${optimized.height}, ${(optimized.optimizedSize / 1024).toFixed(2)}KB (saved ${optimized.savings.toFixed(1)}%)`,
    );

    // Upload to R2
    console.log(`  📤 Uploading to R2...`);
    const r2Url = await uploadBufferToR2(optimized.buffer, optimized.contentType);

    // Update the block with the new R2 URL
    console.log(`  💾 Updating block...`);
    await notion.blocks.update({
      block_id: block.id,
      image: {
        external: { url: r2Url },
        caption: block.image.caption || [],
      },
    } as any);

    return {
      success: true,
      originalUrl: imageUrl,
      newUrl: r2Url,
      originalSize: optimized.originalSize,
      optimizedSize: optimized.optimizedSize,
      savings: optimized.savings,
    };
  } catch (error) {
    console.error(`  ❌ Error optimizing image block:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Extract video URL from a block
 */
function getVideoUrl(block: VideoBlock): string | null {
  if (block.video.type === "external" && block.video.external) {
    return block.video.external.url;
  } else if (block.video.type === "file" && block.video.file) {
    return block.video.file.url;
  }
  return null;
}

/**
 * Upload a single video block to R2 (no transcoding, just re-host)
 */
async function optimizeVideoBlock(block: VideoBlock): Promise<{
  success: boolean;
  originalUrl?: string;
  newUrl?: string;
  size?: number;
  error?: string;
}> {
  try {
    const videoUrl = getVideoUrl(block);
    if (!videoUrl) {
      return { success: false, error: "No video URL found" };
    }

    console.log(`  📥 Downloading video: ${videoUrl.substring(0, 80)}...`);

    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      return { success: false, error: "Failed to download video" };
    }

    const contentType = videoResponse.headers.get("content-type") || "video/mp4";
    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());

    console.log(
      `  📤 Uploading video to R2 (${(videoBuffer.length / 1024 / 1024).toFixed(2)}MB)...`,
    );

    const r2Url = await uploadBufferToR2(videoBuffer, contentType);

    console.log(`  💾 Updating block...`);
    await notion.blocks.update({
      block_id: block.id,
      video: {
        external: { url: r2Url },
        caption: block.video.caption || [],
      },
    } as any);

    return {
      success: true,
      originalUrl: videoUrl,
      newUrl: r2Url,
      size: videoBuffer.length,
    };
  } catch (error) {
    console.error(`  ❌ Error processing video block:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function POST(request: Request) {
  try {
    // Verify webhook secret
    const webhookSecret = process.env.NOTION_WEBHOOK_VERIFICATION_SECRET;
    const providedSecret = request.headers.get("x-webhook-secret");
    if (!webhookSecret || providedSecret !== webhookSecret) {
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

    // Step 2: Filter for image and video blocks
    const imageBlocks = allBlocks.filter(
      (block) => block.type === "image",
    ) as unknown as ImageBlock[];
    const videoBlocks = allBlocks.filter(
      (block) => block.type === "video",
    ) as unknown as VideoBlock[];
    console.log(`Found ${imageBlocks.length} image blocks, ${videoBlocks.length} video blocks\n`);

    if (imageBlocks.length === 0 && videoBlocks.length === 0) {
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

    // Step 3: Optimize each image
    const imageResults = [];
    let imageSuccessCount = 0;
    let imageErrorCount = 0;
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;

    for (let i = 0; i < imageBlocks.length; i++) {
      const block = imageBlocks[i];
      console.log(`Processing image ${i + 1}/${imageBlocks.length}:`);

      const result = await optimizeImageBlock(block);
      imageResults.push(result);

      if (result.success) {
        imageSuccessCount++;
        totalOriginalSize += result.originalSize || 0;
        totalOptimizedSize += result.optimizedSize || 0;
        console.log(`  ✅ Success\n`);
      } else {
        imageErrorCount++;
        console.log(`  ❌ Error: ${result.error}\n`);
      }
    }

    // Step 4: Upload each video to R2
    const videoResults = [];
    let videoSuccessCount = 0;
    let videoErrorCount = 0;
    let totalVideoSize = 0;

    for (let i = 0; i < videoBlocks.length; i++) {
      const block = videoBlocks[i];
      console.log(`Processing video ${i + 1}/${videoBlocks.length}:`);

      const result = await optimizeVideoBlock(block);
      videoResults.push(result);

      if (result.success) {
        videoSuccessCount++;
        totalVideoSize += result.size || 0;
        console.log(`  ✅ Success\n`);
      } else {
        videoErrorCount++;
        console.log(`  ❌ Error: ${result.error}\n`);
      }
    }

    const totalSavings =
      totalOriginalSize > 0 ? ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1) : "0";

    // Invalidate all cached writing content (covers pageId, slug, and shortId keys)
    await invalidateNotionCache("notion:writing:content:*");

    const successCount = imageSuccessCount + videoSuccessCount;
    const errorCount = imageErrorCount + videoErrorCount;

    console.log("=".repeat(50));
    console.log(`✅ Optimization complete!`);
    console.log(`   - Images: ${imageSuccessCount} successful, ${imageErrorCount} failed`);
    console.log(`   - Videos: ${videoSuccessCount} successful, ${videoErrorCount} failed`);
    console.log(`   - Image original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   - Image optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   - Image savings: ${totalSavings}%`);
    console.log(`   - Video size uploaded: ${(totalVideoSize / 1024 / 1024).toFixed(2)}MB`);
    console.log("=".repeat(50) + "\n");

    return NextResponse.json(
      {
        success: true,
        message: "Writing media optimized and uploaded to R2 successfully",
        stats: {
          images: {
            total: imageBlocks.length,
            successful: imageSuccessCount,
            failed: imageErrorCount,
            originalSize: totalOriginalSize,
            optimizedSize: totalOptimizedSize,
            savings: `${totalSavings}%`,
          },
          videos: {
            total: videoBlocks.length,
            successful: videoSuccessCount,
            failed: videoErrorCount,
            totalSize: totalVideoSize,
          },
          total: imageBlocks.length + videoBlocks.length,
          successful: successCount,
          failed: errorCount,
        },
        results: [...imageResults, ...videoResults],
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error optimizing writing images", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(`Failed to optimize writing images: ${errorMessage}`, 500, error);
  }
}
