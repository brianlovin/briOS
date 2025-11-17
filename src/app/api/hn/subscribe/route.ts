import { NextResponse } from "next/server";
import { z } from "zod";

import { errorResponse } from "@/lib/api-utils";
import { createSubscription } from "@/lib/subscriptions";

// Request body schema with email validation
const SubscribeSchema = z.object({
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = SubscribeSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("Invalid email address", 400, result.error.issues);
    }

    const { email } = result.data;
    const { success, alreadyExists } = await createSubscription(email);

    if (alreadyExists) {
      return errorResponse("This email is already subscribed", 409);
    }

    if (!success) {
      return errorResponse("Failed to subscribe. Please try again.", 500);
    }

    console.log(`✅ New HN digest subscription: ${email}`);

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to HN digest",
    });
  } catch (error) {
    console.error("Error in subscribe route:", error);
    return errorResponse("Failed to subscribe");
  }
}
