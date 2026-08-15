import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "bun:test";

describe("urls", () => {
  test("does not import jwt, email, or postmark", () => {
    const src = readFileSync(join(import.meta.dir, "urls.ts"), "utf8");

    expect(src).not.toContain("./jwt");
    expect(src).not.toContain("./email");
    expect(src).not.toContain("@/lib/jwt");
    expect(src).not.toContain("@/lib/email");
    expect(src.toLowerCase()).not.toContain("postmark");
  });

  test("formatDigestDate is callable without JWT_SIGNING_KEY", async () => {
    const previous = process.env.JWT_SIGNING_KEY;
    delete process.env.JWT_SIGNING_KEY;

    try {
      const { formatDigestDate } = await import("./urls");
      expect(formatDigestDate(new Date(2026, 7, 15))).toBe("August 15th, 2026");
    } finally {
      if (previous !== undefined) {
        process.env.JWT_SIGNING_KEY = previous;
      }
    }
  });

  test("buildUnsubscribeUrl keeps the hn-digest unsubscribe path", async () => {
    const { BASE_URL, buildUnsubscribeUrl } = await import("./urls");

    expect(buildUnsubscribeUrl("abc.def.ghi")).toBe(
      `${BASE_URL}/api/hn-digest/unsubscribe?token=abc.def.ghi`,
    );
  });
});
