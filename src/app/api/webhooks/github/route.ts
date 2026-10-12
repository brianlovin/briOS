import { NextResponse } from "next/server";

import { recordGithubActivity, verifyGithubWebhookSignature } from "@/lib/activity";
import { getActivityStore } from "@/lib/activity-redis";
import { errorResponse } from "@/lib/api-utils";
import { track } from "@/lib/axiom";
import { annotate, withAxiom } from "@/lib/observability/axiom-route";

/**
 * GitHub webhook producer for the public /activity feed.
 * Verifies X-Hub-Signature-256 and calls ingestActivityEvent in-process.
 * Does not go through POST /api/activity HMAC ingest.
 */
async function postHandler(request: Request) {
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
  annotate({ github_event: githubEvent });
  if (githubEvent === "ping") {
    annotate({ outcome: "ignored", reason: "ping" });
    return NextResponse.json({ ok: true, ignored: "ping" });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    annotate({ outcome: "ignored", reason: "invalid_json" });
    return NextResponse.json({ ok: true, ignored: "invalid_json" });
  }

  const store = getActivityStore();
  if (!store) {
    return errorResponse("Activity store is not configured", 503);
  }

  const result = await recordGithubActivity(githubEvent, payload, store);
  if ("skipped" in result) {
    annotate({ outcome: "ignored", reason: result.reason });
    return NextResponse.json({ ok: true, ignored: result.reason });
  }
  if (!result.ok) {
    annotate({ outcome: "ignored", reason: result.error });
    return NextResponse.json({ ok: true, ignored: result.error });
  }

  annotate({ outcome: "recorded" });
  track("activity.ingested", {
    producer: "github",
    source: "github",
    type: githubEvent,
    duplicate: result.duplicate,
  });
  return NextResponse.json({ ok: true, id: result.id, duplicate: result.duplicate });
}

export const POST = withAxiom(postHandler, { name: "github", kind: "webhook" });
