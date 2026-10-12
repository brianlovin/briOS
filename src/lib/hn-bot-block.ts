import type { checkBotId } from "botid/server";
import type { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-utils";
import { track } from "@/lib/axiom";
import { logger } from "@/lib/logger";
import { markExpectedRejection } from "@/lib/observability/axiom-route";
import { requestContext } from "@/lib/request-context";

type BotIdVerification = Awaited<ReturnType<typeof checkBotId>>;

/**
 * - `no_botid_token`: the request never ran the BotID client script (the
 *   browser fetch patch from `initBotId` adds `x-is-human`), so it is a direct
 *   HTTP client such as a scraper, not someone browsing the site.
 * - `verified_bot`: a known crawler BotID identified by name.
 * - `classified_bot`: BotID scored a challenged request as a bot.
 */
export type HnBotBlockReason = "no_botid_token" | "verified_bot" | "classified_bot";

export function hnBotBlockReason(
  headers: Headers,
  verification: Pick<BotIdVerification, "isVerifiedBot">,
): HnBotBlockReason {
  if (!headers.get("x-is-human")) return "no_botid_token";
  if (verification.isVerifiedBot) return "verified_bot";
  return "classified_bot";
}

/** 403 for a BotID-flagged `/api/hn` read, recorded as an expected block rather than a failure. */
export function rejectHnBot(request: Request, verification: BotIdVerification): NextResponse {
  const path = new URL(request.url).pathname;
  const reason = hnBotBlockReason(request.headers, verification);
  const verifiedBotName =
    "verifiedBotName" in verification ? verification.verifiedBotName : undefined;

  markExpectedRejection();
  track("hn.bot_blocked", {
    path,
    reason,
    ...(verifiedBotName && { verified_bot_name: verifiedBotName }),
    ...requestContext(request),
  });
  logger.info("[HN] Blocked bot request", { path, reason });

  return errorResponse("Access denied", 403);
}
