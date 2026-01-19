import crypto from "crypto";

import { slugify } from "./utils";

const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const SHORT_ID_LENGTH = 7;
const SHORT_ID_PATTERN = /^[a-zA-Z0-9]{7}$/;

/**
 * Generate a random 7-character base62 Short ID.
 * Uses crypto.randomBytes for secure randomness.
 */
export function generateShortId(): string {
  const bytes = crypto.randomBytes(SHORT_ID_LENGTH);
  let result = "";
  for (let i = 0; i < SHORT_ID_LENGTH; i++) {
    result += BASE62_CHARS[bytes[i] % 62];
  }
  return result;
}

/**
 * Validate that a string matches the Short ID format (7 alphanumeric characters).
 */
export function isValidShortId(id: string): boolean {
  return SHORT_ID_PATTERN.test(id);
}

/**
 * Extract the Short ID from a URL slug.
 * Expects format: "some-title-slug-aB3xK9m" where the last segment is the Short ID.
 * Returns null if no valid Short ID is found.
 */
export function extractShortIdFromSlug(slug: string): string | null {
  const parts = slug.split("-");
  if (parts.length < 2) return null;

  const lastPart = parts[parts.length - 1];
  return isValidShortId(lastPart) ? lastPart : null;
}

/**
 * Build a full URL slug from a title and Short ID.
 * Example: ("My Blog Post", "aB3xK9m") => "my-blog-post-aB3xK9m"
 */
export function buildSlug(title: string, shortId: string): string {
  const titleSlug = slugify(title);
  return `${titleSlug}-${shortId}`;
}
