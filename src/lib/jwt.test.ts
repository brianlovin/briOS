import { readFileSync } from "node:fs";
import { join } from "node:path";

import { afterAll, beforeAll, describe, expect, test } from "bun:test";

const TEST_JWT_SIGNING_KEY = "test-jwt-signing-key-s08-1";

async function loadJwt() {
  const previousPostmark = process.env.POSTMARK_CLIENT_ID;
  process.env.JWT_SIGNING_KEY = process.env.JWT_SIGNING_KEY || TEST_JWT_SIGNING_KEY;
  delete process.env.POSTMARK_CLIENT_ID;

  try {
    return await import("./jwt");
  } finally {
    if (previousPostmark !== undefined) {
      process.env.POSTMARK_CLIENT_ID = previousPostmark;
    }
  }
}

describe("jwt", () => {
  const originalError = console.error;

  beforeAll(() => {
    console.error = () => {};
  });

  afterAll(() => {
    console.error = originalError;
  });

  test("does not import email.ts or postmark", () => {
    const src = readFileSync(join(import.meta.dir, "jwt.ts"), "utf8");

    expect(src).not.toContain("./email");
    expect(src).not.toContain("@/lib/email");
    expect(src.toLowerCase()).not.toContain("postmark");
  });

  test("signs and verifies { email } without constructing Postmark", async () => {
    const { generateUnsubscribeToken, verifyUnsubscribeToken } = await loadJwt();
    const email = "reader@example.com";

    expect(verifyUnsubscribeToken(generateUnsubscribeToken(email))).toBe(email);
  });

  test("returns null for an invalid token", async () => {
    const { verifyUnsubscribeToken } = await loadJwt();

    expect(verifyUnsubscribeToken("not-a-jwt")).toBeNull();
  });

  test("returns null when the payload is not { email }", async () => {
    process.env.JWT_SIGNING_KEY = process.env.JWT_SIGNING_KEY || TEST_JWT_SIGNING_KEY;
    const jwt = await import("jsonwebtoken");
    const { verifyUnsubscribeToken } = await loadJwt();
    const token = jwt.default.sign({ notEmail: true }, process.env.JWT_SIGNING_KEY as string);

    expect(verifyUnsubscribeToken(token)).toBeNull();
  });
});
