import { connection, NextResponse } from "next/server";

import { recordDigestSent } from "@/lib/activity";
import { afterActivity } from "@/lib/activity-schedule";
import { errorResponse, safeCompare } from "@/lib/api-utils";
import { type EventFieldMap, toErrorMessage, track } from "@/lib/axiom";
import { digestRunStatus, toDigestPosts } from "@/lib/digest";
import { BASE_EMAIL, generateUnsubscribeUrl, sendHNDigestEmailBatch } from "@/lib/email";
import { getHNPostsForDigest } from "@/lib/hn";
import { logger } from "@/lib/logger";
import { annotate, withAxiom } from "@/lib/observability/axiom-route";
import { getHNSubscribers } from "@/lib/subscriptions";
import { formatDigestDate } from "@/lib/urls";

const IS_PROD = process.env.NODE_ENV === "production";

type DigestRunStatus = EventFieldMap["hn.digest.run"]["status"];

async function handler(request: Request) {
  // cacheComponents forbids `dynamic` / `revalidate` segment configs.
  // connection() is the Next 16 equivalent of force-dynamic for this cron.
  await connection();

  const start = performance.now();
  const run = { total_subscribers: 0, sent: 0, failed: 0, post_count: 0 };
  const finish = (status: DigestRunStatus, error?: string) => {
    const event = {
      ...run,
      duration_ms: Math.round(performance.now() - start),
      status,
      ...(error && { error }),
    };
    annotate(event);
    track("hn.digest.run", event);
  };

  try {
    const authHeader = request.headers.get("authorization");
    const providedToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!safeCompare(providedToken, process.env.CRON_SECRET)) {
      return errorResponse("Unauthorized", 401);
    }

    // Fetch top HN posts for the digest (uncached — must be today's set)
    const posts = await getHNPostsForDigest();

    if (!posts || posts.length === 0) {
      finish("no_posts", "No posts found for digest");
      return errorResponse("No posts found for digest", 500);
    }
    run.post_count = posts.length;

    console.log(
      `[HN Digest] ${posts.length} posts: ${posts
        .map((post) => `${post.id} "${post.title}"`)
        .join(", ")}`,
    );

    const date = formatDigestDate();

    let subscribers = await getHNSubscribers();

    // In development, only send to the base email for testing
    if (!IS_PROD) {
      subscribers = subscribers.filter((email) => email === BASE_EMAIL);
      console.log(`[DEV] Filtered to ${subscribers.length} test subscriber(s)`);
    }
    run.total_subscribers = subscribers.length;

    console.log(`Sending digest to ${subscribers.length} subscribers`);

    const digestPosts = toDigestPosts(posts);

    const emails = subscribers.map((email) => ({
      to: email,
      date,
      posts: digestPosts,
      unsubscribeUrl: generateUnsubscribeUrl(email),
    }));

    const { successCount, failureCount } = await sendHNDigestEmailBatch(emails);
    run.sent = successCount;
    run.failed = failureCount;
    finish(digestRunStatus(subscribers.length, successCount, failureCount));

    if (successCount > 0) {
      afterActivity((store) => recordDigestSent({ date, postCount: digestPosts.length }, store));
    }

    return NextResponse.json(
      {
        status: "done",
        emailsSent: successCount,
        failures: failureCount,
        totalSubscribers: subscribers.length,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    logger.error("Error processing HN digest", error);
    finish("error", toErrorMessage(error));
    return errorResponse("Failed to process HN digest");
  }
}

export const GET = withAxiom(handler, { name: "hn-digest", kind: "cron" });
