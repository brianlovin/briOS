import { NextResponse } from "next/server";

import { recordSiteAdded } from "@/lib/activity";
import { titleFromNotionPage } from "@/lib/activity-from-notion";
import { afterActivity } from "@/lib/activity-schedule";
import { errorResponse, safeCompare } from "@/lib/api-utils";
import { optimizeSiteIcon } from "@/lib/image-processing/optimize";
import { logger } from "@/lib/logger";
import { notion } from "@/lib/notion";
import { purgeContentType } from "@/lib/notion/purge";
import { annotate, withAxiom } from "@/lib/observability/axiom-route";
import { uploadBufferToR2 } from "@/lib/r2/storage";
import { getBestFaviconUrl, isDataUrl, parseDataUrl } from "@/lib/utils/favicon";

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
async function postHandler(request: Request) {
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
      logger.warn("Missing required field: data.id (pageId)");
      annotate({ outcome: "invalid_payload" });
      return errorResponse("Missing required field: data.id (pageId)", 400);
    }

    annotate({ page_id: pageId });
    if (!urlProperty) {
      logger.warn("Missing required field: data.properties.URL", { page_id: pageId });
      annotate({ outcome: "invalid_payload" });
      return errorResponse("Missing required field: data.properties.URL", 400);
    }

    // Extract URL from Notion property object
    const url = typeof urlProperty === "string" ? urlProperty : urlProperty.url;

    if (!url) {
      logger.warn("URL property is empty or invalid", { page_id: pageId });
      annotate({ outcome: "invalid_payload" });
      return errorResponse("URL property is empty or invalid", 400);
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      logger.warn("Invalid URL format", { page_id: pageId, url });
      annotate({ outcome: "invalid_payload", url });
      return errorResponse("Invalid URL format", 400);
    }

    // Step 1: Get best favicon URL (may be HTTP URL or data URL)
    annotate({ url });
    const iconUrl = await getBestFaviconUrl(url);
    if (!iconUrl) {
      logger.error("Failed to fetch favicon", undefined, { page_id: pageId, url });
      annotate({ outcome: "failed", failed_step: "find_favicon" });
      return errorResponse("Failed to fetch favicon", 500);
    }

    // Step 2: Get favicon as buffer (handle both data URLs and HTTP URLs)
    let faviconBuffer: Buffer;

    if (isDataUrl(iconUrl)) {
      // Parse base64 data URL directly
      const parsed = parseDataUrl(iconUrl);
      if (!parsed) {
        logger.error("Failed to parse data URL favicon", undefined, { page_id: pageId, url });
        annotate({ outcome: "failed", failed_step: "parse_data_url" });
        return errorResponse("Failed to parse data URL favicon", 500);
      }
      faviconBuffer = parsed.buffer;
    } else {
      // Download favicon from HTTP URL
      const faviconResponse = await fetch(iconUrl);
      if (!faviconResponse.ok) {
        logger.error("Failed to download favicon", undefined, {
          page_id: pageId,
          url,
          http_status: faviconResponse.status,
        });
        annotate({ outcome: "failed", failed_step: "download_favicon" });
        return errorResponse("Failed to download favicon", 500);
      }

      const faviconArrayBuffer = await faviconResponse.arrayBuffer();
      faviconBuffer = Buffer.from(faviconArrayBuffer);
    }

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

    await purgeContentType("sites");
    annotate({ outcome: "updated" });

    const page = await notion.pages.retrieve({ page_id: pageId });
    afterActivity((store) =>
      recordSiteAdded({ id: pageId, title: titleFromNotionPage(page), url }, store),
    );

    return NextResponse.json(
      {
        success: true,
        message: "Good website icon uploaded to R2 and updated successfully",
        iconUrl: r2Url,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error updating good website icon", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(`Failed to update good website icon: ${errorMessage}`, 500, error);
  }
}

export const POST = withAxiom(postHandler, { name: "notion.update-site-icon", kind: "webhook" });
