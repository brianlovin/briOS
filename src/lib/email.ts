import { ServerClient } from "postmark";

import { HackerNewsPost } from "@/types/hackernews";

/**
 * Email service for sending HN digest emails via Postmark
 */

// Email constants
export const BASE_EMAIL = "hi@brianlovin.com";

export const BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://brianlovin.com";

const POSTMARK_TEMPLATE_ID = 18037634;

// Environment validation
if (!process.env.POSTMARK_CLIENT_ID) {
  throw new Error("POSTMARK_CLIENT_ID environment variable is not set");
}

// Create singleton Postmark client
const postmarkClient = new ServerClient(process.env.POSTMARK_CLIENT_ID);

export interface DigestEmailData {
  to: string;
  date: string;
  posts: HackerNewsPost[];
  unsubscribeUrl: string;
}

/**
 * Send a Hacker News digest email to a subscriber
 */
export async function sendHNDigestEmail({ to, date, posts, unsubscribeUrl }: DigestEmailData) {
  const result = await postmarkClient.sendEmailWithTemplate({
    From: BASE_EMAIL,
    To: to,
    TemplateId: POSTMARK_TEMPLATE_ID,
    TemplateModel: {
      date,
      posts,
      unsubscribe_url: unsubscribeUrl,
    },
  });

  console.log(`✅ Sent HN digest to ${to}`, {
    messageId: result.MessageID,
    submittedAt: result.SubmittedAt,
  });

  return result;
}

/**
 * Send HN digest emails in batch using Postmark's batch API
 * Postmark supports up to 500 messages per batch call
 */
export async function sendHNDigestEmailBatch(
  emails: DigestEmailData[],
): Promise<{ successCount: number; failureCount: number }> {
  const BATCH_SIZE = 500;
  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);
    const messages = batch.map((email) => ({
      From: BASE_EMAIL,
      To: email.to,
      TemplateId: POSTMARK_TEMPLATE_ID,
      TemplateModel: {
        date: email.date,
        posts: email.posts,
        unsubscribe_url: email.unsubscribeUrl,
      },
    }));

    try {
      const results = await postmarkClient.sendEmailBatchWithTemplates(messages);
      for (const result of results) {
        if (result.ErrorCode === 0) {
          successCount++;
        } else {
          console.error(`Failed to send to ${result.To}: ${result.Message}`);
          failureCount++;
        }
      }
      console.log(`Sent batch of ${results.length} HN digest emails`);
    } catch (err) {
      console.error(`Error sending email batch (offset ${i}):`, err);
      failureCount += batch.length;
    }
  }

  return { successCount, failureCount };
}
