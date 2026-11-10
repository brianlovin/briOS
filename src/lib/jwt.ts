import jwt from "jsonwebtoken";
import { z } from "zod";

/**
 * JWT token utilities for unsubscribe links.
 * Signs and verifies `{ email }` only — no URL construction, dates, or mailer.
 */

if (!process.env.JWT_SIGNING_KEY) {
  throw new Error("JWT_SIGNING_KEY environment variable is not set");
}

const JWT_SECRET = process.env.JWT_SIGNING_KEY;

// Schema for unsubscribe token payload (using non-deprecated pattern)
const UnsubscribeTokenSchema = z.object({
  email: z.string(),
});

export type UnsubscribeTokenPayload = z.infer<typeof UnsubscribeTokenSchema>;

/**
 * Generate a JWT token for email unsubscribe links
 */
export function generateUnsubscribeToken(email: string): string {
  return jwt.sign({ email }, JWT_SECRET);
}

/**
 * Verify and decode a JWT unsubscribe token
 * Returns the email if valid, null if invalid
 */
export function verifyUnsubscribeToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    const result = UnsubscribeTokenSchema.safeParse(decoded);

    if (!result.success) {
      console.error("Invalid token payload:", result.error);
      return null;
    }

    return result.data.email;
  } catch (error) {
    console.error("Error verifying JWT token:", error);
    return null;
  }
}

const SUBSCRIBE_CONFIRM_PURPOSE = "hn-subscribe-confirm";

const SubscribeConfirmTokenSchema = z.object({
  email: z.string(),
  purpose: z.literal(SUBSCRIBE_CONFIRM_PURPOSE),
});

/**
 * Short-lived token mailed to a new subscriber. Only someone who can read
 * that inbox can present it, which is what proves the address is theirs.
 */
export function generateSubscribeConfirmToken(email: string): string {
  return jwt.sign({ email, purpose: SUBSCRIBE_CONFIRM_PURPOSE }, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "2d",
  });
}

/** Email from a valid, unexpired confirmation token, or null. */
export function verifySubscribeConfirmToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    const result = SubscribeConfirmTokenSchema.safeParse(decoded);
    return result.success ? result.data.email : null;
  } catch {
    return null;
  }
}
