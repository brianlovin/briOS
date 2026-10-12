import { NextResponse } from "next/server";

import { track } from "@/lib/axiom";
import { verifyUnsubscribeToken } from "@/lib/jwt";
import { withAxiom } from "@/lib/observability/axiom-route";
import { isBotUserAgent } from "@/lib/request-context";
import { deleteSubscription } from "@/lib/subscriptions";
import { BASE_URL } from "@/lib/urls";

async function handler(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const userAgent = request.headers.get("user-agent") ?? undefined;
  const client = {
    source: "email_link" as const,
    user_agent: userAgent?.slice(0, 300),
    is_bot: isBotUserAgent(userAgent),
  };

  // Verify and process unsubscribe if valid token
  if (token) {
    const email = verifyUnsubscribeToken(token);

    if (email) {
      const deleted = await deleteSubscription(email);

      if (deleted) {
        console.log(`✅ Successfully unsubscribed: ${email}`);
        track("hn.unsubscribed", { ...client, email });
      } else {
        console.log(`Subscription not found for ${email}`);
        track("hn.unsubscribe_failed", { ...client, email, reason: "not_found" });
      }
    } else {
      console.error("Invalid or expired token");
      track("hn.unsubscribe_failed", { ...client, reason: "invalid_token" });
    }
  } else {
    track("hn.unsubscribe_failed", { ...client, reason: "missing_token" });
  }

  // Always redirect to /hn page regardless of outcome
  return NextResponse.redirect(`${BASE_URL}/hn`);
}

export const GET = withAxiom(handler, { name: "/api/hn-digest/unsubscribe" });
