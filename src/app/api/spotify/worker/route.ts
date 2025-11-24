import { Receiver } from "@upstash/qstash";
import { NextRequest, NextResponse } from "next/server";

import { notion } from "@/lib/notion/client";
import {
  addTrackToNotion,
  delay,
  getJournalEntryIdForDate,
  notionTrackExists,
  RATE_LIMIT_MS,
  RecentlyPlayedItem,
  toPacificDateString,
} from "@/lib/spotify";

// Initialize QStash Receiver for signature verification
const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text();

    const signature = req.headers.get("upstash-signature");
    if (!signature) {
      console.error("[Worker] Missing Upstash-Signature header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify signature
    const isValid = await receiver.verify({ signature, body: rawBody });
    if (!isValid) {
      console.error("[Worker] Invalid QStash signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the body
    let item: RecentlyPlayedItem;
    try {
      item = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("[Worker] Failed to parse request body:", parseError);
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    if (!item || !item.track || !item.played_at) {
      console.error("[Worker] Invalid payload structure received from QStash:", item);
      return NextResponse.json({ error: "Invalid payload structure" }, { status: 400 });
    }

    // Check if track already exists in Notion
    const exists = await notionTrackExists(notion, item.track.id, item.played_at);
    if (exists) {
      console.log(`[Worker] Track already exists, skipping.`);
      return NextResponse.json({ success: true, status: "skipped" });
    }

    // Find the corresponding journal entry ID
    const pacificDate = toPacificDateString(item.played_at);
    const journalId = await getJournalEntryIdForDate(notion, pacificDate);

    // Respect Notion rate limit before writing
    await delay(RATE_LIMIT_MS);

    // Add track to Notion
    await addTrackToNotion(notion, item, journalId);

    return NextResponse.json({ success: true, status: "added" });
  } catch (error: any) {
    console.error("[Worker] Error processing track:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Worker processing failed",
      },
      { status: 500 },
    );
  }
}
