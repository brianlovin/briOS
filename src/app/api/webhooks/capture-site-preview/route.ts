import { NextResponse } from "next/server";

import { recordSiteAdded } from "@/lib/activity";
import { titleFromNotionPage } from "@/lib/activity-from-notion";
import { afterActivity } from "@/lib/activity-schedule";
import { errorResponse, safeCompare } from "@/lib/api-utils";
import { optimizeSitePreview } from "@/lib/image-processing/optimize";
import { notion } from "@/lib/notion";
import { purgeContentType } from "@/lib/notion/purge";
import { uploadBufferToR2 } from "@/lib/r2/storage";
import { captureLightAndDarkScreenshots } from "@/lib/screenshot";

// Two navigations can each take ~30s + settle. One browser, sequential captures.
export const maxDuration = 120;

/**
 * Webhook endpoint to capture website screenshots and store them in R2
 *
 * POST /api/webhooks/capture-site-preview
 * Notion automation payload: { data: { id, properties: { URL } } }
 *
 * Flow:
 * 1. Extract page ID and URL from Notion webhook
 * 2. Set status to "Processing"
 * 3. Capture light and dark viewport screenshots (one browser, two navigations)
 * 4. Optimize both images (resize, compress to WebP)
 * 5. Upload both to R2 storage
 * 6. Update Notion page with preview URLs and status
 */
export async function POST(request: Request) {
  try {
    // Verify webhook secret
    const webhookSecret = process.env.NOTION_WEBHOOK_VERIFICATION_SECRET;
    const providedSecret = request.headers.get("x-webhook-secret");
    if (!safeCompare(providedSecret, webhookSecret)) {
      return errorResponse("Unauthorized", 401);
    }

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

    // Check current status to prevent duplicate processing
    const currentPage = await notion.pages.retrieve({ page_id: pageId });
    const currentStatus = (
      currentPage as { properties: { "Preview Status"?: { select?: { name: string } | null } } }
    ).properties?.["Preview Status"]?.select?.name;

    if (currentStatus === "Processing") {
      console.log(`Page ${pageId} is already being processed, skipping`);
      return NextResponse.json(
        { success: true, message: "Already processing", skipped: true },
        { status: 200 },
      );
    }

    // Step 1: Set status to Processing
    await notion.pages.update({
      page_id: pageId,
      properties: {
        "Preview Status": { select: { name: "Processing" } },
        "Preview Error": { rich_text: [] }, // Clear any previous error
      },
    });

    try {
      // Step 2: Capture light and dark screenshots
      console.log(`Capturing light and dark screenshots for: ${url}`);
      const screenshots = await captureLightAndDarkScreenshots(url);
      console.log(
        `Screenshots captured: light ${(screenshots.light.length / 1024).toFixed(0)}KB, dark ${(screenshots.dark.length / 1024).toFixed(0)}KB`,
      );

      // Step 3–4: Optimize and upload both
      const previewUrl = await optimizeAndUploadPreview(screenshots.light, "light");
      const previewUrlDark = await optimizeAndUploadPreview(screenshots.dark, "dark");

      // Step 5: Update Notion page with success
      await notion.pages.update({
        page_id: pageId,
        properties: {
          "Preview Status": { select: { name: "Done" } },
          "Preview Image": { url: previewUrl },
          "Preview Image Dark": { url: previewUrlDark },
          "Preview Updated": { date: { start: new Date().toISOString() } },
        },
      });

      await purgeContentType("sites");

      afterActivity((store) =>
        recordSiteAdded({ id: pageId, title: titleFromNotionPage(currentPage), url }, store),
      );

      return NextResponse.json(
        {
          success: true,
          message: "Site preview captured and uploaded successfully",
          previewUrl,
          previewUrlDark,
        },
        { status: 200 },
      );
    } catch (captureError) {
      // Update Notion with error status
      const errorMessage = captureError instanceof Error ? captureError.message : "Unknown error";
      console.error("Error capturing screenshot:", captureError);

      await notion.pages.update({
        page_id: pageId,
        properties: {
          "Preview Status": { select: { name: "Error" } },
          "Preview Error": {
            rich_text: [{ text: { content: errorMessage.slice(0, 2000) } }],
          },
        },
      });

      await purgeContentType("sites");

      throw captureError;
    }
  } catch (error) {
    console.error("Error capturing site preview:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(`Failed to capture site preview: ${errorMessage}`, 500, error);
  }
}

async function optimizeAndUploadPreview(
  screenshot: Buffer,
  scheme: "light" | "dark",
): Promise<string> {
  const optimized = await optimizeSitePreview(screenshot);
  console.log(
    `Optimized ${scheme} preview: ${optimized.width}x${optimized.height}, ${(optimized.optimizedSize / 1024).toFixed(2)}KB (saved ${optimized.savings.toFixed(1)}%)`,
  );

  const r2Url = await uploadBufferToR2(optimized.buffer, optimized.contentType);
  console.log(`Uploaded ${scheme} preview to R2: ${r2Url}`);
  return r2Url;
}
