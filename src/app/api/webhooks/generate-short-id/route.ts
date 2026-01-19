import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-utils";
import { updateWritingShortId } from "@/lib/notion/mutations";
import { getWritingPostByShortId, getWritingPostContent } from "@/lib/notion/queries";
import { generateShortId, isValidShortId } from "@/lib/short-id";

/**
 * Webhook endpoint to generate a Short ID for a writing post
 *
 * POST /api/webhooks/generate-short-id
 * Notion automation payload: { data: { id } }
 *
 * Flow:
 * 1. Extract page ID from Notion webhook
 * 2. Check if page already has a Short ID
 * 3. Generate a unique Short ID
 * 4. Update the page with the new Short ID
 */

const MAX_RETRIES = 5;

export async function POST(request: Request) {
  try {
    // Verify webhook secret if configured
    // Notion automations should include header: x-webhook-secret: <NOTION_WEBHOOK_VERIFICATION_SECRET>
    const webhookSecret = process.env.NOTION_WEBHOOK_VERIFICATION_SECRET;
    if (webhookSecret) {
      const providedSecret = request.headers.get("x-webhook-secret");
      if (providedSecret !== webhookSecret) {
        return errorResponse("Unauthorized", 401);
      }
    }

    const body = await request.json();

    // Extract page ID from Notion webhook payload
    const pageId = body.data?.id;

    if (!pageId) {
      console.error("Missing required field: data.id (pageId)", body);
      return errorResponse("Missing required field: data.id (pageId)", 400);
    }

    console.log(`\n🔑 Generating Short ID for page ${pageId}\n`);

    // Check if page already has a Short ID
    const content = await getWritingPostContent(pageId);
    if (!content) {
      return errorResponse("Page not found", 404);
    }

    if (content.metadata.shortId && isValidShortId(content.metadata.shortId)) {
      console.log(`Page already has Short ID: ${content.metadata.shortId}`);
      return NextResponse.json(
        {
          success: true,
          message: "Page already has a Short ID",
          shortId: content.metadata.shortId,
          title: content.metadata.title,
        },
        { status: 200 },
      );
    }

    // Generate a unique Short ID with collision checking
    let shortId: string | null = null;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const candidate = generateShortId();
      console.log(`Attempt ${attempt + 1}: Generated candidate ${candidate}`);

      const existing = await getWritingPostByShortId(candidate);

      if (!existing) {
        shortId = candidate;
        break;
      }

      console.log(`Collision detected, retrying...`);
    }

    if (!shortId) {
      return errorResponse("Failed to generate unique Short ID after maximum retries", 500);
    }

    // Update the page with the new Short ID
    console.log(`Updating page with Short ID: ${shortId}`);
    await updateWritingShortId(pageId, shortId);

    console.log(`✅ Successfully generated Short ID: ${shortId} for "${content.metadata.title}"\n`);

    return NextResponse.json(
      {
        success: true,
        message: "Short ID generated successfully",
        shortId,
        title: content.metadata.title,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error generating Short ID:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(`Failed to generate Short ID: ${errorMessage}`, 500, error);
  }
}
