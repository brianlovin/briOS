import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api-utils";
import { BASE_EMAIL, sendHNDigestEmail } from "@/lib/email";
import { getHNPostsForDigest } from "@/lib/hn";
import { formatDigestDate, generateUnsubscribeUrl } from "@/lib/jwt";

/**
 * Test endpoint for sending a sample HN digest email
 * Usage: http://localhost:3000/api/hn/test?email=your@email.com
 */
export async function GET(request: Request) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === "production") {
      return errorResponse("Test endpoint only available in development", 403);
    }

    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get("email") || BASE_EMAIL;

    const posts = await getHNPostsForDigest();

    if (!posts || posts.length === 0) {
      return errorResponse("No posts found for digest", 500);
    }

    const date = formatDigestDate();
    const unsubscribeUrl = generateUnsubscribeUrl(testEmail);

    console.log(`📧 Sending test digest to ${testEmail} with ${posts.length} posts`);

    await sendHNDigestEmail({
      to: testEmail,
      date,
      posts,
      unsubscribeUrl,
    });

    return NextResponse.json({
      status: "success",
      message: `Test digest email sent to ${testEmail}`,
      data: {
        email: testEmail,
        date,
        postsCount: posts.length,
        unsubscribeUrl,
      },
    });
  } catch (error) {
    console.error("Error sending test digest:", error);
    return errorResponse("Failed to send test digest");
  }
}
