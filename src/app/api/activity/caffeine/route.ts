import { NextResponse } from "next/server";

import { type ActivityStore, recordCaffeine } from "@/lib/activity";
import { getActivityStore } from "@/lib/activity-redis";
import { ACTIVITY_BODY_MAX_BYTES, CAFFEINE_DRINK_MAX_LENGTH } from "@/lib/activity-shared";
import { errorResponse, safeCompare } from "@/lib/api-utils";

function providedToken(request: Request): string | null {
  const headerToken = request.headers.get("x-activity-token");
  if (headerToken) return headerToken;

  const authorization = request.headers.get("authorization");
  if (authorization?.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }

  return null;
}

/**
 * Shortcut-friendly caffeine ingest.
 * Auth is a shared bearer / x-activity-token — HMAC is painful inside Shortcuts.
 */
export async function handleCaffeinePost(
  request: Request,
  store: ActivityStore | null,
): Promise<NextResponse> {
  const expected = process.env.ACTIVITY_CAFFEINE_TOKEN;
  if (!expected) {
    return errorResponse("Caffeine ingest is not configured", 503);
  }

  if (!safeCompare(providedToken(request), expected)) {
    return errorResponse("Unauthorized", 401);
  }

  const raw = await request.text();
  if (raw.length > ACTIVITY_BODY_MAX_BYTES) {
    return errorResponse("Payload too large", 413);
  }

  let drink: unknown;
  try {
    const body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    drink = body.drink;
  } catch {
    return errorResponse("Invalid JSON", 400);
  }

  if (typeof drink !== "string") {
    return errorResponse("drink is required", 400);
  }

  const trimmed = drink.trim();
  if (!trimmed || trimmed.length > CAFFEINE_DRINK_MAX_LENGTH) {
    return errorResponse("drink is required", 400);
  }

  if (!store) {
    return NextResponse.json({ ok: true });
  }

  try {
    const result = await recordCaffeine({ drink: trimmed }, store);
    if (!result.ok) {
      return errorResponse(result.error, result.status);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[activity] caffeine ingest failed", error);
    return NextResponse.json({ ok: true });
  }
}

export async function POST(request: Request) {
  return handleCaffeinePost(request, getActivityStore());
}
