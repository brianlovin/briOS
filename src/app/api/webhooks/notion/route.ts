import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import {
  revalidateAmaQuestions,
  revalidateDesignDetailsEpisodes,
  revalidateListening,
  revalidateSpeaking,
  revalidateStacks,
  revalidateWebsites,
  revalidateWritingPosts,
} from "@/app/actions/revalidate";

/**
 * Notion Webhook Handler
 *
 * Receives webhook events from Notion and revalidates the appropriate content.
 *
 * Setup:
 * 1. Add NOTION_WEBHOOK_SECRET to .env.local (the verification_token from Notion)
 * 2. Add your database IDs to the DATABASE_TO_CACHE_TAG mapping below
 * 3. Deploy this endpoint to a public URL
 * 4. Set up webhook in Notion integration settings
 * 5. Subscribe to these events:
 *    - page.content_updated
 *    - page.created
 *    - page.deleted
 *    - database.created
 *    - database.updated
 *    - database.deleted
 *
 * Notion will send events whenever content changes in databases your integration has access to.
 */

// Map Notion database IDs to cache tags
// Update these with your actual Notion database IDs from environment variables
const DATABASE_TO_CACHE_TAG: Record<string, () => Promise<{ success: boolean }>> = {
  // Stack items database
  [process.env.NOTION_STACK_DATABASE_ID || ""]: revalidateStacks,

  // AMA questions database
  [process.env.NOTION_AMA_DATABASE_ID || ""]: revalidateAmaQuestions,

  // Good websites database
  [process.env.NOTION_GOOD_WEBSITES_DATABASE_ID || ""]: revalidateWebsites,

  // Writing posts database
  [process.env.NOTION_WRITING_DATABASE_ID || ""]: revalidateWritingPosts,

  // Listening history database (uses NOTION_MUSIC_DATABASE_ID)
  [process.env.NOTION_MUSIC_DATABASE_ID || ""]: revalidateListening,

  // Design Details episodes database
  [process.env.NOTION_DESIGN_DETAILS_EPISODES_DATABASE_ID || ""]: revalidateDesignDetailsEpisodes,

  // Speaking engagements database
  [process.env.NOTION_SPEAKING_DATABASE_ID || ""]: revalidateSpeaking,
};

// Notion webhook event types
type NotionWebhookEvent = {
  object: "event";
  id: string;
  timestamp: string;
  workspace_id: string;
  workspace_name?: string;
  subscription_id: string;
  integration_id: string;
  type:
    | "page.content_updated"
    | "page.created"
    | "page.deleted"
    | "page.locked"
    | "page.moved"
    | "page.properties_updated"
    | "page.undeleted"
    | "page.unlocked"
    | "database.content_updated"
    | "database.created"
    | "database.deleted"
    | "database.moved"
    | "database.schema_updated"
    | "database.undeleted"
    | "data_source.content_updated"
    | "data_source.created"
    | "data_source.deleted"
    | "data_source.moved"
    | "data_source.schema_updated"
    | "data_source.undeleted"
    | "comment.created"
    | "comment.updated"
    | "comment.deleted";
  authors: Array<{
    id: string;
    type: "person" | "bot" | "agent";
  }>;
  accessible_by?: Array<{
    id: string;
    type: "person" | "bot";
  }>;
  attempt_number: number;
  entity: {
    type: "page" | "block" | "database" | "data_source" | "comment";
    id: string;
  };
  data?: {
    parent?: {
      id: string;
      type: "page" | "database" | "database_id" | "space" | "block";
    };
    updated_blocks?: Array<{
      id: string;
      type: "block";
    }>;
    updated_properties?:
      | Array<{
          id: string;
          name: string;
          action: "created" | "updated" | "deleted";
        }>
      | string[];
    page_id?: string;
  };
};

// Verification token payload (first request from Notion)
type VerificationPayload = {
  verification_token: string;
};

/**
 * Validates the webhook signature using HMAC-SHA256
 */
function validateSignature(body: string, signature: string, secret: string): boolean {
  const calculatedSignature = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;

  try {
    return timingSafeEqual(Buffer.from(calculatedSignature), Buffer.from(signature));
  } catch {
    return false;
  }
}

/**
 * Normalize a Notion ID by removing hyphens
 * Webhook events include hyphens in IDs, but env vars don't
 */
function normalizeNotionId(id: string): string {
  return id.replace(/-/g, "");
}

/**
 * Get a human-readable name for a database ID
 */
function getDatabaseName(databaseId: string): string {
  const normalizedId = normalizeNotionId(databaseId);
  const mapping: Record<string, string> = {
    [process.env.NOTION_STACK_DATABASE_ID || ""]: "Stack Items",
    [process.env.NOTION_AMA_DATABASE_ID || ""]: "AMA Questions",
    [process.env.NOTION_GOOD_WEBSITES_DATABASE_ID || ""]: "Good Websites",
    [process.env.NOTION_WRITING_DATABASE_ID || ""]: "Writing Posts",
    [process.env.NOTION_MUSIC_DATABASE_ID || ""]: "Listening History",
    [process.env.NOTION_DESIGN_DETAILS_EPISODES_DATABASE_ID || ""]: "Design Details Episodes",
    [process.env.NOTION_SPEAKING_DATABASE_ID || ""]: "Speaking Engagements",
  };

  return mapping[normalizedId] || "Unknown Database";
}

/**
 * Determines which cache tag to revalidate based on the event
 */
async function handleNotionEvent(event: NotionWebhookEvent): Promise<{
  success: boolean;
  message: string;
}> {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`[Notion Webhook] 📥 Event Type: ${event.type}`);
  console.log(`[Notion Webhook] 📄 Entity Type: ${event.entity.type}`);
  console.log(`[Notion Webhook] 🆔 Entity ID: ${event.entity.id}`);

  if (event.data?.parent) {
    console.log(`[Notion Webhook] 📂 Parent Type: ${event.data.parent.type}`);
    console.log(`[Notion Webhook] 📂 Parent ID: ${event.data.parent.id}`);
  }

  // For page events, check if the page belongs to a database
  if (event.entity.type === "page") {
    const parent = event.data?.parent;

    // Check if the parent is a database (type can be "database" or "database_id")
    if (parent && (parent.type === "database" || parent.type === "database_id")) {
      const databaseId = parent.id;
      const normalizedDatabaseId = normalizeNotionId(databaseId);
      const databaseName = getDatabaseName(databaseId);
      console.log(`[Notion Webhook] 🗄️  Database: ${databaseName}`);
      console.log(`[Notion Webhook] 🔑 Normalized ID: ${normalizedDatabaseId}`);

      const revalidateFunction = DATABASE_TO_CACHE_TAG[normalizedDatabaseId];

      if (revalidateFunction) {
        console.log(`[Notion Webhook] ✅ Found cache mapping for: ${databaseName}`);
        console.log(`[Notion Webhook] 🔄 Starting cache revalidation...`);

        const startTime = Date.now();
        const result = await revalidateFunction();
        const duration = Date.now() - startTime;

        if (result.success) {
          console.log(`[Notion Webhook] ✨ Cache revalidated successfully in ${duration}ms`);
          console.log(`[Notion Webhook] 💾 Next request will fetch fresh data from Notion`);
          console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
          return {
            success: true,
            message: `Successfully revalidated ${databaseName} cache in ${duration}ms`,
          };
        } else {
          console.error(`[Notion Webhook] ❌ Cache revalidation failed for ${databaseName}`);
          console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
          return {
            success: false,
            message: `Failed to revalidate cache for ${databaseName}`,
          };
        }
      } else {
        console.log(
          `[Notion Webhook] ⚠️  No cache mapping found for database: ${normalizedDatabaseId}`,
        );
        console.log(
          `[Notion Webhook] ℹ️  This database is not configured for automatic revalidation`,
        );
        console.log(`[Notion Webhook] 💡 Available databases:`);
        Object.entries(DATABASE_TO_CACHE_TAG).forEach(([id]) => {
          if (id) {
            console.log(`[Notion Webhook]    - ${getDatabaseName(id)} (${id})`);
          }
        });
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        return {
          success: true,
          message: `No revalidation needed - database ${databaseName} not mapped`,
        };
      }
    } else {
      // Page is not in a database (might be in a page, space, etc.)
      console.log(
        `[Notion Webhook] ℹ️  Page is not in a database (parent type: ${parent?.type || "none"})`,
      );
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      return {
        success: true,
        message: `Page event processed (not in a tracked database)`,
      };
    }
  }

  // For database and data_source events, use the entity ID directly
  if (event.entity.type === "database" || event.entity.type === "data_source") {
    const databaseId = event.entity.id;
    const normalizedDatabaseId = normalizeNotionId(databaseId);
    const databaseName = getDatabaseName(databaseId);
    console.log(`[Notion Webhook] 🗄️  Database: ${databaseName}`);
    console.log(`[Notion Webhook] 🔑 Normalized ID: ${normalizedDatabaseId}`);

    const revalidateFunction = DATABASE_TO_CACHE_TAG[normalizedDatabaseId];

    if (revalidateFunction) {
      console.log(`[Notion Webhook] ✅ Found cache mapping for: ${databaseName}`);
      console.log(`[Notion Webhook] 🔄 Starting cache revalidation...`);

      const startTime = Date.now();
      const result = await revalidateFunction();
      const duration = Date.now() - startTime;

      if (result.success) {
        console.log(`[Notion Webhook] ✨ Cache revalidated successfully in ${duration}ms`);
        console.log(`[Notion Webhook] 💾 Next request will fetch fresh data from Notion`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        return {
          success: true,
          message: `Successfully revalidated ${databaseName} cache in ${duration}ms`,
        };
      } else {
        console.error(`[Notion Webhook] ❌ Cache revalidation failed for ${databaseName}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        return {
          success: false,
          message: `Failed to revalidate cache for ${databaseName}`,
        };
      }
    } else {
      console.log(
        `[Notion Webhook] ⚠️  No cache mapping found for database: ${normalizedDatabaseId}`,
      );
      console.log(
        `[Notion Webhook] ℹ️  This database is not configured for automatic revalidation`,
      );
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      return {
        success: true,
        message: `No revalidation needed - database ${databaseName} not mapped`,
      };
    }
  }

  // For other event types (comments, blocks, etc.)
  console.log(`[Notion Webhook] ℹ️  Event type ${event.type} does not require revalidation`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  return {
    success: true,
    message: `Event type ${event.type} processed (no revalidation needed)`,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Read the raw body for signature validation
    const rawBody = await request.text();
    let body: NotionWebhookEvent | VerificationPayload;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    // Handle initial verification request from Notion
    // This happens BEFORE we have the webhook secret configured
    if ("verification_token" in body) {
      console.log("[Notion Webhook] Received verification request");
      console.log("[Notion Webhook] Verification token:", body.verification_token);
      console.log("[Notion Webhook] Copy this token and:");
      console.log("[Notion Webhook] 1. Paste it in Notion webhook settings to verify");
      console.log("[Notion Webhook] 2. Add it to .env.local as NOTION_WEBHOOK_SECRET");
      console.log("[Notion Webhook] 3. Add it to Vercel environment variables");

      return NextResponse.json(
        {
          message: "Verification token received. Follow the steps in the logs to complete setup.",
          verification_token: body.verification_token,
          next_steps: [
            "Copy the verification_token from this response",
            "Go back to Notion webhook settings and click 'Verify'",
            "Paste the token and verify the subscription",
            "Add NOTION_WEBHOOK_SECRET to your environment variables with this token",
            "Redeploy your app",
          ],
        },
        { status: 200 },
      );
    }

    // For all subsequent webhook events, we need the secret
    const webhookSecret = process.env.NOTION_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Notion Webhook] NOTION_WEBHOOK_SECRET not configured");
      console.error("[Notion Webhook] This should be set after initial verification");
      return NextResponse.json(
        {
          error:
            "Webhook not configured. Please add NOTION_WEBHOOK_SECRET to environment variables.",
          hint: "This should be the verification_token you received during initial setup.",
        },
        { status: 500 },
      );
    }

    // Validate the webhook signature for all subsequent requests
    const signature = request.headers.get("x-notion-signature");

    if (!signature) {
      console.error("[Notion Webhook] Missing signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const isValid = validateSignature(rawBody, signature, webhookSecret);

    if (!isValid) {
      console.error("[Notion Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Process the webhook event
    const event = body as NotionWebhookEvent;
    const result = await handleNotionEvent(event);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[Notion Webhook] Error processing webhook:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
