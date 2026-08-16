import { createHmac } from "crypto";
import { NextResponse } from "next/server";

import { type ActivityIngestInput, ingestActivityEvent } from "@/lib/activity";
import { getActivityStore } from "@/lib/activity-redis";
import { ACTIVITY_BODY_MAX_BYTES } from "@/lib/activity-shared";
import { errorResponse, safeCompare } from "@/lib/api-utils";

/**
 * HMAC ingest for external producers.
 * (source, type) must be in the activity registry. In-repo producers
 * (likes, first-party visits) call ingestActivityEvent directly.
 */
export async function POST(request: Request) {
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

  return NextResponse.json({ id: result.id, duplicate: result.duplicate });
}
