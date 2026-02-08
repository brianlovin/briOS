import { NextResponse } from "next/server";

import { getStackItemByNotionId, updateStackItemByNotionId } from "@/db/queries/stack";
import { errorResponse } from "@/lib/api-utils";
import { optimizeSiteIcon } from "@/lib/image-processing/optimize";
import { uploadBufferToR2 } from "@/lib/r2/storage";

/**
 * Webhook endpoint to optimize existing page icon and upload to R2
 *
 * POST /api/webhooks/process-stack-icon
 * Payload: { data: { id } }
 *
 * Flow:
 * 1. Extract page ID from webhook
 * 2. Look up stack item in Postgres to get existing icon URL
 * 3. Download the icon image as buffer
 * 4. Optimize icon (resize to max 80x80px, compress)
 * 5. Upload to R2 storage
 * 6. Update Postgres with R2 URL
 */
export async function POST(request: Request) {
  try {
    // Verify webhook secret
    const webhookSecret = process.env.NOTION_WEBHOOK_VERIFICATION_SECRET;
    const providedSecret = request.headers.get("x-webhook-secret");
    if (!webhookSecret || providedSecret !== webhookSecret) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();

    // Extract page ID from webhook payload
    const pageId = body.data?.id;

    // Validate required fields
    if (!pageId) {
      console.error("Missing required field: data.id (pageId)", body);
      return errorResponse("Missing required field: data.id (pageId)", 400);
    }

    // Step 1: Look up the stack item in Postgres
    const item = await getStackItemByNotionId(pageId);
    if (!item) {
      console.error("Stack item not found for notionId:", pageId);
      return errorResponse("Stack item not found", 404);
    }

    const iconUrl = item.icon || item.image;
    if (!iconUrl) {
      console.error("Page has no icon to process", pageId, body);
      return errorResponse("Page has no icon to process", 400);
    }

    console.log(`Processing icon for stack item ${item.id}: ${iconUrl}`);

    // Step 2: Download the icon
    const iconResponse = await fetch(iconUrl);
    if (!iconResponse.ok) {
      console.error("Failed to download icon", iconUrl, body);
      return errorResponse("Failed to download icon", 500);
    }

    const iconArrayBuffer = await iconResponse.arrayBuffer();
    const iconBuffer = Buffer.from(iconArrayBuffer);

    // Step 3: Optimize the icon (resize to max 80x80px, compress)
    const optimized = await optimizeSiteIcon(iconBuffer);

    console.log(
      `Optimized icon: ${optimized.width}x${optimized.height}, ${(optimized.optimizedSize / 1024).toFixed(2)}KB (saved ${optimized.savings.toFixed(1)}%)`,
    );

    // Step 4: Upload optimized icon to R2
    const r2Url = await uploadBufferToR2(optimized.buffer, optimized.contentType);

    // Step 5: Update Postgres with R2 URL
    await updateStackItemByNotionId(pageId, { icon: r2Url });

    return NextResponse.json(
      {
        success: true,
        message: "Stack icon optimized and uploaded to R2 successfully",
        iconUrl: r2Url,
        originalSize: iconBuffer.length,
        optimizedSize: optimized.optimizedSize,
        savings: `${optimized.savings.toFixed(1)}%`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing stack icon", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(`Failed to process stack icon: ${errorMessage}`, 500, error);
  }
}
