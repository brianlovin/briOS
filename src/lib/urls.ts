import { format } from "date-fns";

/**
 * Site origin and digest helpers with no mailer or token dependency.
 * Unsubscribe verify and date formatting should not construct a mailer.
 */

export const BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://brianlovin.com";

/**
 * Format date for digest emails
 */
export function formatDigestDate(date: Date = new Date()): string {
  return format(date, "LLLL do, yyyy");
}

/**
 * Build the HN digest unsubscribe URL for a signed token.
 * Path is `/api/hn-digest/unsubscribe?token=` (old `/api/hn/unsubscribe` redirects).
 */
export function buildUnsubscribeUrl(token: string): string {
  return `${BASE_URL}/api/hn-digest/unsubscribe?token=${token}`;
}
