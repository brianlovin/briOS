import { NextResponse } from "next/server";

import { errorResponse, safeCompare } from "@/lib/api-utils";
import { toDigestPosts } from "@/lib/digest";
import { BASE_EMAIL, generateUnsubscribeUrl, sendHNDigestEmailBatch } from "@/lib/email";
import { getHNPostsForDigest } from "@/lib/hn";
import { getHNSubscribers } from "@/lib/subscriptions";
import { formatDigestDate } from "@/lib/urls";

const IS_PROD = process.env.NODE_ENV === "production";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const providedToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!safeCompare(providedToken, process.env.CRON_SECRET)) {
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
      subscribers = subscribers.filter((email) => email === BASE_EMAIL);
      console.log(`[DEV] Filtered to ${subscribers.length} test subscriber(s)`);
    }

    console.log(`Sending digest to ${subscribers.length} subscribers`);

    const digestPosts = toDigestPosts(posts);

    const emails = subscribers.map((email) => ({
      to: email,
      date,
      posts: digestPosts,
      unsubscribeUrl: generateUnsubscribeUrl(email),
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
