import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-utils";
import { BASE_EMAIL, sendHNDigestEmailBatch } from "@/lib/email";
import { getHNPostsForDigest } from "@/lib/hn";
import { formatDigestDate, generateUnsubscribeUrl } from "@/lib/jwt";
import { getHNSubscribers } from "@/lib/subscriptions";

const IS_PROD = process.env.NODE_ENV === "production";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return errorResponse("Unauthorized", 401);
    }

    // Fetch top HN posts for the digest
    const posts = await getHNPostsForDigest();

    if (!posts || posts.length === 0) {
      return errorResponse("No posts found for digest", 500);
    }

    const date = formatDigestDate();

    let subscribers = await getHNSubscribers();

    // In development, only send to the base email for testing
    if (!IS_PROD) {
      subscribers = subscribers.filter((sub) => sub.email === BASE_EMAIL);
      console.log(`[DEV] Filtered to ${subscribers.length} test subscriber(s)`);
    }

    console.log(`Sending digest to ${subscribers.length} subscribers`);

    const emails = subscribers.map((subscriber) => ({
      to: subscriber.email,
      date,
      posts,
      unsubscribeUrl: generateUnsubscribeUrl(subscriber.email),
    }));

    const { successCount, failureCount } = await sendHNDigestEmailBatch(emails);

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
