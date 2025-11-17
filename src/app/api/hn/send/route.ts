import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-utils";
import { BASE_EMAIL, sendHNDigestEmail } from "@/lib/email";
import { getHNPostsForDigest } from "@/lib/hn";
import { formatDigestDate, generateUnsubscribeUrl } from "@/lib/jwt";
import { getHNSubscribers } from "@/lib/subscriptions";

const IS_PROD = process.env.NODE_ENV === "production";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const warmup = searchParams.get("warmup");

    /*
      This API route is triggered from a GitHub action. Sometimes the function
      can take a while to warm up though, and will time out. If it times out,
      the action fails. So instead, in the action we actually send 2 requests -
      the first warms up the route, the second actually processes the digest.
    */
    if (warmup) {
      return NextResponse.json({ status: "Warmed up!" });
    }

    // Verify the GitHub Action token
    const secret = process.env.HN_TOKEN;
    if (!token || token !== secret) {
      return errorResponse("Invalid token", 401);
    }

    // Fetch top HN posts for the digest
    const posts = await getHNPostsForDigest();

    if (!posts || posts.length === 0) {
      return errorResponse("No posts found for digest", 500);
    }

    const date = formatDigestDate();

    // Fetch subscribers from PlanetScale
    let subscribers = await getHNSubscribers();

    // In development, only send to the base email for testing
    if (!IS_PROD) {
      subscribers = subscribers.filter((sub) => sub.email === BASE_EMAIL);
      console.log(`[DEV] Filtered to ${subscribers.length} test subscriber(s)`);
    }

    console.log(`Sending digest to ${subscribers.length} subscribers`);

    let successCount = 0;
    let failureCount = 0;

    // Send emails to all subscribers
    for (const subscriber of subscribers) {
      try {
        const unsubscribeUrl = generateUnsubscribeUrl(subscriber.email);

        await sendHNDigestEmail({
          to: subscriber.email,
          date,
          posts,
          unsubscribeUrl,
        });

        successCount++;
      } catch (err) {
        console.error("Error sending HN digest email:", {
          email: subscriber.email,
          error: err,
        });
        failureCount++;
      }
    }

    return NextResponse.json({
      status: "done",
      emailsSent: successCount,
      failures: failureCount,
      totalSubscribers: subscribers.length,
    });
  } catch (error) {
    console.error("Error processing HN digest:", error);
    return errorResponse("Failed to process HN digest");
  }
}
