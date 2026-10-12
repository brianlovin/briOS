import { ServerClient } from "postmark";

import { toErrorMessage, track, trackStep } from "@/lib/axiom";
import { DigestPost } from "@/lib/digest";
import { logger } from "@/lib/logger";

import { generateUnsubscribeToken } from "./jwt";
import { buildUnsubscribeUrl } from "./urls";

/**
 * Email service for sending HN digest emails via Postmark
 */

// Email constants
export const BASE_EMAIL = "hi@brianlovin.com";

const POSTMARK_TEMPLATE_ID = 18037634;

/**
 * Generate unsubscribe URL with JWT token
 */
export function generateUnsubscribeUrl(email: string): string {
  return buildUnsubscribeUrl(generateUnsubscribeToken(email));
}

// Environment validation
if (!process.env.POSTMARK_CLIENT_ID) {
  throw new Error("POSTMARK_CLIENT_ID environment variable is not set");
}

// Create singleton Postmark client
const postmarkClient = new ServerClient(process.env.POSTMARK_CLIENT_ID);

export interface DigestEmailData {
  to: string;
  date: string;
  posts: DigestPost[];
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
      const results = await trackStep(
        "hn.digest.batch",
        { batch_offset: i, batch_size: batch.length },
        () => postmarkClient.sendEmailBatchWithTemplates(messages),
      );
      results.forEach((result, index) => {
        if (result.ErrorCode === 0) {
          successCount++;
          return;
        }
        failureCount++;
        const email = result.To ?? batch[index]?.to ?? "unknown";
        console.error(`Failed to send to ${email}: ${result.Message}`);
        track("hn.digest.send_failed", {
          email,
          postmark_error_code: result.ErrorCode,
          postmark_message: result.Message,
        });
      });
      console.log(`Sent batch of ${results.length} HN digest emails`);
    } catch (err) {
      logger.error(`Error sending email batch (offset ${i})`, err, { batch_size: batch.length });
      failureCount += batch.length;
      const postmarkError = err as { code?: unknown; statusCode?: unknown };
      for (const email of batch) {
        track("hn.digest.send_failed", {
          email: email.to,
          postmark_error_code:
            typeof postmarkError.code === "number" ? postmarkError.code : undefined,
          postmark_message: toErrorMessage(err),
          http_status:
            typeof postmarkError.statusCode === "number" ? postmarkError.statusCode : undefined,
        });
      }
    }
  }

  return { successCount, failureCount };
}
