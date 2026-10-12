import { createHmac } from "crypto";
import { NextResponse } from "next/server";

import { type ActivityIngestInput, ingestActivityEvent } from "@/lib/activity";
import { getActivityStore } from "@/lib/activity-redis";
import { ACTIVITY_BODY_MAX_BYTES } from "@/lib/activity-shared";
import { errorResponse, safeCompare } from "@/lib/api-utils";
import { track } from "@/lib/axiom";
import { withAxiom } from "@/lib/observability/axiom-route";

/**
 * HMAC ingest for external producers.
 * (source, type) must be in the activity registry. In-repo producers
 * (likes, first-party visits) call ingestActivityEvent directly.
 */
async function postHandler(request: Request) {
  const secret = process.env.ACTIVITY_INGEST_HMAC_SECRET;
  if (!secret) {
    return errorResponse("Activity ingest is not configured", 503);
  }

  const raw = await request.text();
  if (raw.length > ACTIVITY_BODY_MAX_BYTES) {
    return errorResponse("Payload too large", 413);
  }

  const signature = request.headers.get("x-activity-signature");
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  if (!safeCompare(signature, expected)) {
    return errorResponse("Unauthorized", 401);
  }

  let body: ActivityIngestInput;
  try {
    body = JSON.parse(raw) as ActivityIngestInput;
  } catch {
    return errorResponse("Invalid JSON", 400);
  }

  const store = getActivityStore();
  if (!store) {
    return errorResponse("Activity store is not configured", 503);
  }

  const result = await ingestActivityEvent(body, store);
  if (!result.ok) {
    return errorResponse(result.error, result.status);
  }

  track("activity.ingested", {
    producer: "hmac",
    source: body.source,
    type: body.type,
    duplicate: result.duplicate,
  });
  return NextResponse.json({ id: result.id, duplicate: result.duplicate });
}

export const POST = withAxiom(postHandler, { name: "/api/activity", kind: "webhook" });
