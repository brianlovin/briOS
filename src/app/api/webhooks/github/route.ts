import { NextResponse } from "next/server";

import { recordGithubActivity, verifyGithubWebhookSignature } from "@/lib/activity";
import { getActivityStore } from "@/lib/activity-redis";
import { errorResponse } from "@/lib/api-utils";

/**
 * GitHub webhook producer for the public /activity feed.
 * Verifies X-Hub-Signature-256 and calls ingestActivityEvent in-process.
 * Does not go through POST /api/activity HMAC ingest.
 */
export async function POST(request: Request) {
  const secret = process.env.GITHUB_ACTIVITY_WEBHOOK_SECRET;
  if (!secret) {
    return errorResponse("GitHub activity webhook is not configured", 503);
  }

  const raw = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  if (!verifyGithubWebhookSignature(raw, signature, secret)) {
    return errorResponse("Unauthorized", 401);
  }

  const githubEvent = request.headers.get("x-github-event") ?? "";
  if (githubEvent === "ping") {
    return NextResponse.json({ ok: true, ignored: "ping" });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: true, ignored: "invalid_json" });
  }

  const store = getActivityStore();
  if (!store) {
    return errorResponse("Activity store is not configured", 503);
  }

  const result = await recordGithubActivity(githubEvent, payload, store);
  if ("skipped" in result) {
    return NextResponse.json({ ok: true, ignored: result.reason });
  }
  if (!result.ok) {
    return NextResponse.json({ ok: true, ignored: result.error });
  }

  return NextResponse.json({ ok: true, id: result.id, duplicate: result.duplicate });
}
