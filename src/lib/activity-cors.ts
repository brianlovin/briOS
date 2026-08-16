import { NextResponse } from "next/server";

export const ACTIVITY_PING_ORIGINS = [
  "https://tax-ui.brianlovin.com",
  "https://staff.design",
  "https://www.staff.design",
  "https://designdetails.fm",
  "https://www.designdetails.fm",
] as const;

export type ActivityPingOrigin = (typeof ACTIVITY_PING_ORIGINS)[number];

export function isActivityPingOrigin(
  origin: string | null | undefined,
): origin is ActivityPingOrigin {
  if (!origin) return false;
  return (ACTIVITY_PING_ORIGINS as readonly string[]).includes(origin);
}

export function activityPingCorsHeaders(
  origin: string | null | undefined,
): Record<string, string> | null {
  if (!isActivityPingOrigin(origin)) return null;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
  };
}

export function applyActivityPingCors(request: Request, response: NextResponse): NextResponse {
  const headers = activityPingCorsHeaders(request.headers.get("origin"));
  if (!headers) return response;
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  return response;
}

export function activityPingOptions(request: Request): NextResponse {
  return applyActivityPingCors(request, new NextResponse(null, { status: 204 }));
}

export function activityPingJson(
  request: Request,
  body: unknown,
  init?: ResponseInit,
): NextResponse {
  return applyActivityPingCors(request, NextResponse.json(body, init));
}
