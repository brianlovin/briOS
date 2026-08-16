/**
 * Client-side Sentry filters for noise that is not application code.
 *
 * BRIOS-1 is a Safari Web Extension error: a content script called
 * `runtime.sendMessage()` after the tab was gone. That API is not used
 * anywhere in this repo. The rejection has no stack frames, so denyUrls
 * cannot catch it — ignoreErrors must match the message.
 *
 * Sentry treats string patterns as substring matches.
 */

export const SENTRY_IGNORE_ERRORS: Array<string | RegExp> = [
  // Safari Web Extension: content script messages a missing tab.
  "Invalid call to runtime.sendMessage()",
  // Chrome / Firefox: extension was reloaded, updated, or its background page died.
  "Extension context invalidated",
  "message port closed before a response was received",
  "Could not establish connection. Receiving end does not exist",
];

export const SENTRY_DENY_URLS: Array<string | RegExp> = [
  /^chrome-extension:\/\//i,
  /^moz-extension:\/\//i,
  /^safari-extension:\/\//i,
  /^safari-web-extension:\/\//i,
  /^webkit-masked-url:\/\//i,
];

export function matchesIgnoreError(
  message: string,
  patterns: Array<string | RegExp> = SENTRY_IGNORE_ERRORS,
): boolean {
  return patterns.some((pattern) =>
    typeof pattern === "string" ? message.includes(pattern) : pattern.test(message),
  );
}
