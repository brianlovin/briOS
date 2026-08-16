import { describe, expect, test } from "bun:test";

import { matchesIgnoreError, SENTRY_IGNORE_ERRORS } from "@/lib/observability/client-filters";

describe("matchesIgnoreError", () => {
  test("ignores the BRIOS-1 Safari extension message", () => {
    expect(matchesIgnoreError("Invalid call to runtime.sendMessage(). Tab not found.")).toBe(true);
  });

  test("ignores related browser-extension messaging failures", () => {
    expect(matchesIgnoreError("Extension context invalidated.")).toBe(true);
    expect(matchesIgnoreError("The message port closed before a response was received.")).toBe(
      true,
    );
    expect(
      matchesIgnoreError("Could not establish connection. Receiving end does not exist."),
    ).toBe(true);
  });

  test("does not ignore application errors", () => {
    expect(matchesIgnoreError("TypeError: Cannot read properties of undefined")).toBe(false);
    expect(matchesIgnoreError("Failed to fetch")).toBe(false);
    expect(matchesIgnoreError("")).toBe(false);
  });

  test("supports regex patterns the same way Sentry does", () => {
    expect(matchesIgnoreError("Exact Match Message", [/^Exact Match Message$/])).toBe(true);
    expect(matchesIgnoreError("Exact Match Message extra", [/^Exact Match Message$/])).toBe(false);
  });

  test("exports the patterns used by the client SDK", () => {
    expect(SENTRY_IGNORE_ERRORS.length).toBeGreaterThan(0);
    expect(SENTRY_IGNORE_ERRORS).toContain("Invalid call to runtime.sendMessage()");
  });
});
