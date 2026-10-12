import { Receiver } from "@upstash/qstash";
import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { annotate, withAxiom } from "@/lib/observability/axiom-route";
import { captureError, withErrorCapture } from "@/lib/observability/sentry";
import {
  addTrackToNotion,
  delay,
  notionTrackExists,
  RATE_LIMIT_MS,
  RecentlyPlayedItem,
} from "@/lib/spotify/sync";

// Initialize QStash Receiver for signature verification
const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

async function postHandler(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text();

    const signature = req.headers.get("upstash-signature");
    if (!signature) {
      logger.warn("[Worker] Missing Upstash-Signature header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify signature
    const isValid = await receiver.verify({ signature, body: rawBody });
    if (!isValid) {
      logger.warn("[Worker] Invalid QStash signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the body
    let item: RecentlyPlayedItem;
    try {
      item = JSON.parse(rawBody);
    } catch (parseError) {
      logger.error("[Worker] Failed to parse request body", parseError);
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    if (!item || !item.track || !item.played_at) {
      logger.error("[Worker] Invalid payload structure received from QStash");
      return NextResponse.json({ error: "Invalid payload structure" }, { status: 400 });
    }

    annotate({ track_id: item.track.id, track_name: item.track.name, played_at: item.played_at });

    // Check if track already exists in Notion
    const exists = await notionTrackExists(item.track.id, item.played_at);
    if (exists) {
      console.log(`[Worker] Track already exists, skipping.`);
      annotate({ outcome: "skipped" });
      return NextResponse.json({ success: true, status: "skipped" });
    }

    // Respect Notion rate limit before writing
    await delay(RATE_LIMIT_MS);

    // Add track to Notion
    await addTrackToNotion(item);
    annotate({ outcome: "added" });

    return NextResponse.json({ success: true, status: "added" });
  } catch (error: unknown) {
    logger.error("[Worker] Error processing track", error);
    annotate({ outcome: "failed" });
    captureError(error, { feature: "spotify-sync", trigger: "worker" });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Worker processing failed",
      },
      { status: 500 },
    );
  }
}

export const POST = withAxiom(withErrorCapture(postHandler), {
  name: "spotify.worker",
  kind: "webhook",
});
