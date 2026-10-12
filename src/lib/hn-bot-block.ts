import type { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-utils";
import { markExpectedRejection } from "@/lib/observability/axiom-route";

/**
 * 403 for a BotID-flagged `/api/hn` read. Scrapers hit these routes
 * constantly, so blocks are deliberately not tracked or logged.
 */
export function rejectHnBot(): NextResponse {
  markExpectedRejection();
  return errorResponse("Access denied", 403);
}
