import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import {
  getWritingPostByNotionId,
  getWritingPostByShortId,
  updateWritingPostShortId,
} from "@/db/queries/writing";
import { errorResponse } from "@/lib/api-utils";
import { generateShortId, isValidShortId } from "@/lib/short-id";

/**
 * Webhook endpoint to generate a Short ID for a writing post
 *
 * POST /api/webhooks/generate-short-id
 * Notion automation payload: { data: { id } }
 *
 * Flow:
 * 1. Extract page ID from Notion webhook
 * 2. Look up post in Postgres by notionId
 * 3. Check if it already has a Short ID
 * 4. Generate a unique Short ID
 * 5. Update Postgres with the new Short ID
 */

const MAX_RETRIES = 5;

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

    if (!pageId) {
      console.error("Missing required field: data.id (pageId)", body);
      return errorResponse("Missing required field: data.id (pageId)", 400);
    }

    console.log(`\n🔑 Generating Short ID for page ${pageId}\n`);

    // Look up by notionId in Postgres
    const post = await getWritingPostByNotionId(pageId);
    if (!post) {
      return errorResponse("Page not found in database", 404);
    }

    if (post.shortId && isValidShortId(post.shortId)) {
      console.log(`Page already has Short ID: ${post.shortId}`);
      return NextResponse.json(
        {
          success: true,
          message: "Page already has a Short ID",
          shortId: post.shortId,
          title: post.title,
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

    // Update Postgres with the new Short ID
    console.log(`Updating post with Short ID: ${shortId}`);
    await updateWritingPostShortId(post.id, shortId);

    revalidateTag("writing", { expire: 0 });

    console.log(`✅ Successfully generated Short ID: ${shortId} for "${post.title}"\n`);

    return NextResponse.json(
      {
        success: true,
        message: "Short ID generated successfully",
        shortId,
        title: post.title,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error generating Short ID:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(`Failed to generate Short ID: ${errorMessage}`, 500, error);
  }
}
