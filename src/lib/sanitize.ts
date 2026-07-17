import sanitizeHtmlLib from "sanitize-html";

/**
 * Allow-list for HTML that originates from external, untrusted sources
 * (e.g. Hacker News post and comment bodies). Kept intentionally small.
 */
const HN_SANITIZE_OPTIONS: sanitizeHtmlLib.IOptions = {
  allowedTags: ["p", "a", "code", "pre", "em", "strong", "i", "b", "br"],
  allowedAttributes: {
    a: ["href", "rel", "target"],
  },
};

/**
 * Sanitize untrusted HTML from Hacker News. `sanitize-html` is pure JS (no
 * DOM/jsdom), so it runs in both server (SSR, API routes) and browser
 * environments — content is never emitted unsanitized into server-rendered
 * markup.
 */
export function sanitizeExternalHtml(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtmlLib(html, HN_SANITIZE_OPTIONS);
}
