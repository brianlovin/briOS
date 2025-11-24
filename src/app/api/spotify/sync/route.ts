/**
 * Sync recently-played Spotify tracks into the Notion "Music" DB.
 *
 * • Converts Spotify UTC timestamps → Pacific date (America/Los_Angeles)
 *   so late-night listens attach to the right journal entry.
 * • Deduplicates both per-run and against existing Notion rows.
 * • Obeys Notion rate limits (400 ms between writes).
 */

import { Client } from "@upstash/qstash";
import { NextRequest, NextResponse } from "next/server";

import { fetchRecentSpotifyItems, recentUniqueItems } from "@/lib/spotify";

const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

// Shared sync logic
async function syncTracks(req: NextRequest) {
  // Fetch recent tracks
  const items = await fetchRecentSpotifyItems(50);
  const uniqueItems = recentUniqueItems(items);

  // Build worker URL dynamically based on the request URL
  const baseUrl = new URL(req.url);
  const workerUrl = `${baseUrl.protocol}//${baseUrl.host}/api/spotify/worker`;

  // Queue each track for processing
  const promises = uniqueItems.map(async (item) => {
    await qstash.publishJSON({
      url: workerUrl,
      body: item,
    });
  });

  await Promise.all(promises);

  return NextResponse.json({
    success: true,
    message: `Queued ${uniqueItems.length} tracks for processing`,
  });
}

// Handle POST requests (manual triggers)
export async function POST(req: NextRequest) {
  try {
    return await syncTracks(req);
  } catch (error: any) {
    console.error("Error triggering sync:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to trigger sync",
        details: error.message || "An unexpected error occurred during sync",
        code: "SYNC_FAILED",
      },
      { status: 500 },
    );
  }
}

// Handle GET requests (cron job)
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          details: "Invalid or missing authorization token",
          code: "INVALID_AUTH",
        },
        { status: 401 },
      );
    }

    return await syncTracks(req);
  } catch (error: any) {
    console.error("Error in cron sync:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to sync tracks",
        details: error.message || "An unexpected error occurred during cron sync",
        code: "CRON_SYNC_FAILED",
      },
      { status: 500 },
    );
  }
}
