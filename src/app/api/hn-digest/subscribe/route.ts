import { NextResponse } from "next/server";
import { z } from "zod";

import { errorResponse } from "@/lib/api-utils";
import { track } from "@/lib/axiom";
import { sendHNConfirmationEmail } from "@/lib/email";
import { generateSubscribeConfirmToken } from "@/lib/jwt";
import { logger } from "@/lib/logger";
import { withAxiom } from "@/lib/observability/axiom-route";
import { requestContext } from "@/lib/request-context";
import { claimConfirmationSend, isSubscribed, normalizeEmail } from "@/lib/subscriptions";
import { buildSubscribeConfirmUrl } from "@/lib/urls";

// Request body schema with email validation
const SubscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .max(254)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
});

/**
 * Same response whether the address is new, already subscribed, or recently
 * sent a confirmation, so the endpoint cannot be used to test membership.
 */
function pendingResponse() {
  return NextResponse.json({
    success: true,
    pending: true,
    message: "Check your email to confirm your subscription",
  });
}

async function handler(request: Request) {
  const context = requestContext(request);
  try {
    const body = await request.json();
    const result = SubscribeSchema.safeParse(body);

    if (!result.success) {
      track("hn.subscribe_rejected", { ...context, reason: "invalid_email" });
      return errorResponse("Invalid email address", 400, result.error.issues);
    }

    const email = normalizeEmail(result.data.email);

    if (await isSubscribed(email)) {
      track("hn.subscribe_rejected", { ...context, reason: "already_subscribed", email });
      return pendingResponse();
    }

    if (!(await claimConfirmationSend(email))) {
      track("hn.subscribe_rejected", { ...context, reason: "confirmation_throttled", email });
      return pendingResponse();
    }

    await sendHNConfirmationEmail(
      email,
      buildSubscribeConfirmUrl(generateSubscribeConfirmToken(email)),
    );
    track("hn.subscribe_pending", { ...context, email, source: "web" });

    return pendingResponse();
  } catch (error) {
    logger.error("Error in subscribe route", error);
    return errorResponse("Failed to subscribe");
  }
}

export const POST = withAxiom(handler, { name: "/api/hn-digest/subscribe" });
