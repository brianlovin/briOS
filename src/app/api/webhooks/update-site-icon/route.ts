import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-utils";
import { notion } from "@/lib/notion";
import { getBestFaviconUrl } from "@/lib/utils/favicon";

/**
 * Webhook endpoint to fetch and upload good website favicon to Notion
 *
 * POST /api/webhooks/update-good-website-icon
 * Notion automation payload: { data: { id, properties: { URL } } }
 *
 * Flow:
 * 1. Extract page ID and URL from Notion webhook
 * 2. Fetch favicon from URL
 * 3. Download favicon as buffer
 * 4. Upload to Notion using Direct Upload API
 * 5. Attach uploaded file to page icon
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

    // Determine filename from URL or use default
    const urlObj = new URL(iconUrl);
    const filename = urlObj.pathname.split("/").pop() || `favicon-${new URL(url).hostname}.png`;

    // Step 3: Create Notion file upload
    const createUploadResponse = await fetch("https://api.notion.com/v1/file_uploads", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!createUploadResponse.ok) {
      console.error("Failed to create Notion file upload", body);
      return errorResponse("Failed to create Notion file upload", 500);
    }

    const uploadData = await createUploadResponse.json();
    const { id: uploadId, upload_url } = uploadData;

    // Step 4: Upload file to Notion
    const formData = new FormData();
    formData.append("file", new Blob([faviconBuffer], { type: contentType }), filename);

    const uploadResponse = await fetch(upload_url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      console.error("Failed to upload file to Notion", body);
      return errorResponse("Failed to upload file to Notion", 500);
    }

    // Step 5: Update page icon with uploaded file
    await notion.pages.update({
      page_id: pageId,
      icon: {
        type: "file_upload",
        file_upload: {
          id: uploadId,
        },
      } as any, // Type definition doesn't include file_upload yet
    });

    return NextResponse.json(
      {
        success: true,
        message: "Good website icon uploaded and updated successfully",
        uploadId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating good website icon", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(`Failed to update good website icon: ${errorMessage}`, 500, error);
  }
}
