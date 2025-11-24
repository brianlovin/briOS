import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-utils";
import { optimizeSiteIcon } from "@/lib/image-processing/optimize";
import { notion } from "@/lib/notion";
import { uploadBufferToR2 } from "@/lib/r2/storage";
import { getBestFaviconUrl } from "@/lib/utils/favicon";

/**
 * Webhook endpoint to fetch and upload good website favicon to R2
 *
 * POST /api/webhooks/update-good-website-icon
 * Notion automation payload: { data: { id, properties: { URL } } }
 *
 * Flow:
 * 1. Extract page ID and URL from Notion webhook
 * 2. Fetch favicon from URL
 * 3. Download favicon as buffer
 * 4. Optimize favicon (resize to max 80x80px, compress)
 * 5. Upload to R2 storage
 * 6. Update Notion page icon with R2 URL
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Extract page ID and URL from Notion webhook payload
    const pageId = body.data?.id;
    const urlProperty = body.data?.properties?.URL;

    // Validate required fields
    if (!pageId) {
      console.error("Missing required field: data.id (pageId)", body);
      return errorResponse("Missing required field: data.id (pageId)", 400);
    }

    if (!urlProperty) {
      console.error("Missing required field: data.properties.URL", body);
      return errorResponse("Missing required field: data.properties.URL", 400);
    }

    // Extract URL from Notion property object
    const url = typeof urlProperty === "string" ? urlProperty : urlProperty.url;

    if (!url) {
      console.error("URL property is empty or invalid", body);
      return errorResponse("URL property is empty or invalid", 400);
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      console.error("Invalid URL format", url, body);
      return errorResponse("Invalid URL format", 400);
    }

    // Step 1: Get best favicon URL
    const iconUrl = await getBestFaviconUrl(url);
    if (!iconUrl) {
      console.error("Failed to fetch favicon", url, body);
      return errorResponse("Failed to fetch favicon", 500);
    }

    // Step 2: Download the favicon
    const faviconResponse = await fetch(iconUrl);
    if (!faviconResponse.ok) {
      console.error("Failed to download favicon", url, body);
      return errorResponse("Failed to download favicon", 500);
    }

    const faviconArrayBuffer = await faviconResponse.arrayBuffer();
    const faviconBuffer = Buffer.from(faviconArrayBuffer);

    // Step 3: Optimize the favicon (resize to max 80x80px, compress)
    const optimized = await optimizeSiteIcon(faviconBuffer);

    console.log(
      `Optimized favicon: ${optimized.width}x${optimized.height}, ${(optimized.optimizedSize / 1024).toFixed(2)}KB (saved ${optimized.savings.toFixed(1)}%)`,
    );

    // Step 4: Upload optimized favicon to R2
    const r2Url = await uploadBufferToR2(optimized.buffer, optimized.contentType);

    // Step 5: Update Notion page icon with R2 URL
    await notion.pages.update({
      page_id: pageId,
      icon: {
        type: "external",
        external: { url: r2Url },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Good website icon uploaded to R2 and updated successfully",
        iconUrl: r2Url,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating good website icon", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(`Failed to update good website icon: ${errorMessage}`, 500, error);
  }
}
