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
    const decoded = jwt.verify(token, JWT_SECRET);
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
