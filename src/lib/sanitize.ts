import DOMPurify from "isomorphic-dompurify";

/**
 * Allowed tags/attributes for HTML that originates from external, untrusted
 * sources (e.g. Hacker News post and comment bodies). Kept intentionally small.
 */
const HN_SANITIZE_CONFIG = {
  ALLOWED_TAGS: ["p", "a", "code", "pre", "em", "strong", "i", "b", "br"],
  ALLOWED_ATTR: ["href", "rel", "target"],
};

/**
 * Sanitize untrusted HTML from Hacker News. Works in both server (SSR, API
 * routes) and browser environments via isomorphic-dompurify, so content is
 * never emitted unsanitized into server-rendered markup.
 */
export function sanitizeExternalHtml(html: string | null | undefined): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, HN_SANITIZE_CONFIG);
}
