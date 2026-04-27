import { NextResponse } from "next/server";

import { BASE_URL } from "@/lib/email";
import { verifyUnsubscribeToken } from "@/lib/jwt";
import { deleteSubscription } from "@/lib/subscriptions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // Verify and process unsubscribe if valid token
  if (token) {
    const email = verifyUnsubscribeToken(token);

    if (email) {
      const deleted = await deleteSubscription(email);

      if (deleted) {
        console.log(`✅ Successfully unsubscribed: ${email}`);
      } else {
        console.log(`Subscription not found for ${email}`);
      }
    } else {
      console.error("Invalid or expired token");
    }
  }

  // Always redirect to /hn page regardless of outcome
  return NextResponse.redirect(`${BASE_URL}/hn`);
}
