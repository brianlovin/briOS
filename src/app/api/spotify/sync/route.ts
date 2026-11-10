/**
 * Sync recently-played Spotify tracks into the Notion "Music" DB.
 *
 * Fetches recent tracks and fans each one out to the worker via QStash, which
 * writes it to Notion (with per-track dedup + rate limiting).
 */

import { Client } from "@upstash/qstash";
import { NextRequest, NextResponse } from "next/server";

import { safeCompare } from "@/lib/api-utils";
import { logger } from "@/lib/logger";
import { annotate, withAxiom } from "@/lib/observability/axiom-route";
import { captureError, withErrorCapture } from "@/lib/observability/sentry";
import { fetchRecentSpotifyItems, recentUniqueItems } from "@/lib/spotify/sync";

const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

const WORKER_URL = process.env.SPOTIFY_WORKER_URL ?? "https://brianlovin.com/api/spotify/worker";

// Shared sync logic
async function syncTracks() {
  // Fetch recent tracks
  const items = await fetchRecentSpotifyItems(50);
  const uniqueItems = recentUniqueItems(items);

  // Queue each track for processing
  const promises = uniqueItems.map(async (item) => {
    await qstash.publishJSON({
      url: WORKER_URL,
      body: item,
    });
  });

  await Promise.all(promises);
  annotate({ tracks_fetched: items.length, tracks_queued: uniqueItems.length });

  return NextResponse.json({
    success: true,
    message: `Queued ${uniqueItems.length} tracks for processing`,
  });
}

// Both the cron (GET) and manual triggers (POST) must present
// `Authorization: Bearer <CRON_SECRET>`. safeCompare fails closed when the
// secret is unset.
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  return safeCompare(req.headers.get("authorization"), secret ? `Bearer ${secret}` : undefined);
}

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: "Unauthorized",
      details: "Invalid or missing authorization token",
      code: "INVALID_AUTH",
    },
    { status: 401 },
  );
}

// Handle POST requests (manual triggers)
async function postHandler(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return unauthorizedResponse();
    }

    return await syncTracks();
  } catch (error: unknown) {
    logger.error("Error triggering Spotify sync", error, { trigger: "manual" });
    captureError(error, { feature: "spotify-sync", trigger: "manual" });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to trigger sync",
        details:
          error instanceof Error ? error.message : "An unexpected error occurred during sync",
        code: "SYNC_FAILED",
      },
      { status: 500 },
    );
  }
}

export const POST = withAxiom(withErrorCapture(postHandler), { name: "/api/spotify/sync" });

// Handle GET requests (cron job)
async function getHandler(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return unauthorizedResponse();
    }

    return await syncTracks();
  } catch (error: unknown) {
    logger.error("Error in Spotify cron sync", error, { trigger: "cron" });
    captureError(error, { feature: "spotify-sync", trigger: "cron" });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to sync tracks",
        details:
          error instanceof Error ? error.message : "An unexpected error occurred during cron sync",
        code: "CRON_SYNC_FAILED",
      },
      { status: 500 },
    );
  }
}

export const GET = withAxiom(withErrorCapture(getHandler), { name: "spotify-sync", kind: "cron" });
