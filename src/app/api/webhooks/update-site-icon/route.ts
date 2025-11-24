import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-utils";
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
 * 4. Upload to R2 storage
 * 5. Update Notion page icon with R2 URL
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

    const faviconBuffer = await faviconResponse.arrayBuffer();
    const contentType = faviconResponse.headers.get("content-type") || "image/png";

    // Step 3: Upload favicon to R2
    const r2Url = await uploadBufferToR2(faviconBuffer, contentType);

    // Step 4: Update Notion page icon with R2 URL
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
