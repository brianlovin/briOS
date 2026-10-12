import { NextResponse } from "next/server";
import { z } from "zod";

import { recordDigestSubscribed } from "@/lib/activity";
import { afterActivity } from "@/lib/activity-schedule";
import { errorResponse } from "@/lib/api-utils";
import { track } from "@/lib/axiom";
import { logger } from "@/lib/logger";
import { withAxiom } from "@/lib/observability/axiom-route";
import { requestContext } from "@/lib/request-context";
import { createSubscription } from "@/lib/subscriptions";

// Request body schema with email validation
const SubscribeSchema = z.object({
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
});

async function handler(request: Request) {
  const context = requestContext(request);
  try {
    const body = await request.json();
    const result = SubscribeSchema.safeParse(body);

    if (!result.success) {
      track("hn.subscribe_rejected", { ...context, reason: "invalid_email" });
      return errorResponse("Invalid email address", 400, result.error.issues);
    }

    const { email } = result.data;
    const { success, alreadyExists } = await createSubscription(email);

    if (alreadyExists) {
      track("hn.subscribe_rejected", { ...context, reason: "already_subscribed", email });
      return errorResponse("This email is already subscribed", 409);
    }

    if (!success) {
      track("hn.subscribe_rejected", { ...context, reason: "store_error", email });
      return errorResponse("Failed to subscribe. Please try again.", 500);
    }

    track("hn.subscribed", { ...context, email, source: "web" });
    afterActivity((store) => recordDigestSubscribed({ email }, store));

    console.log("✅ New HN digest subscription");

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to HN digest",
    });
  } catch (error) {
    logger.error("Error in subscribe route", error);
    return errorResponse("Failed to subscribe");
  }
}

export const POST = withAxiom(handler, { name: "/api/hn-digest/subscribe" });
