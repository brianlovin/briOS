import { NextResponse } from "next/server";

import { ACTIVITY_FEED_CACHE_CONTROL } from "./activity-shared";

/**
 * Public, cookie-free cache headers for the activity poll blob.
 * Do not read cookies/auth in handlers that use this — the response must
 * stay CDN-cacheable with no per-user Vary.
 */
export const ACTIVITY_FEED_CACHE_HEADERS = {
  "Cache-Control": ACTIVITY_FEED_CACHE_CONTROL,
  "CDN-Cache-Control": ACTIVITY_FEED_CACHE_CONTROL,
};

export function activityCachedJson<T>(data: T): NextResponse<T> {
  return NextResponse.json(data, { headers: ACTIVITY_FEED_CACHE_HEADERS });
}
