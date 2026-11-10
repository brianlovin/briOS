import { NextResponse } from "next/server";

import { recordDigestSubscribed } from "@/lib/activity";
import { afterActivity } from "@/lib/activity-schedule";
import { track } from "@/lib/axiom";
import { verifySubscribeConfirmToken } from "@/lib/jwt";
import { logger } from "@/lib/logger";
import { withAxiom } from "@/lib/observability/axiom-route";
import { requestContext } from "@/lib/request-context";
import { createSubscription, normalizeEmail } from "@/lib/subscriptions";
import { BASE_URL } from "@/lib/urls";

// Second step of the double opt-in: the link from the confirmation email.
async function handler(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const email = token ? verifySubscribeConfirmToken(token) : null;

  if (!email) {
    track("hn.subscribe_confirm_failed", { reason: "invalid_token" });
    return NextResponse.redirect(`${BASE_URL}/hn?subscribe=invalid`);
  }

  const normalized = normalizeEmail(email);
  try {
    const { success } = await createSubscription(normalized);
    if (success) {
      track("hn.subscribed", { ...requestContext(request), email: normalized, source: "web" });
      afterActivity((store) => recordDigestSubscribed({ email: normalized }, store));
    }
    // Re-clicking a used link lands on the same page: already subscribed.
    return NextResponse.redirect(`${BASE_URL}/hn?subscribed=1`);
  } catch (error) {
    logger.error("Error confirming HN digest subscription", error);
    track("hn.subscribe_confirm_failed", { reason: "store_error" });
    return NextResponse.redirect(`${BASE_URL}/hn?subscribe=error`);
  }
}

export const GET = withAxiom(handler, { name: "/api/hn-digest/confirm" });
