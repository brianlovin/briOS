import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { POST } from "./route";

const TEST_SECRET = "unit-test-webhook-secret";

function webhookRequest(body: unknown, secret?: string): Request {
  return new Request("http://localhost/api/webhooks/illustrate-journal", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(secret ? { "x-webhook-secret": secret } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/webhooks/illustrate-journal", () => {
  const previousSecret = process.env.NOTION_WEBHOOK_VERIFICATION_SECRET;

  beforeEach(() => {
    process.env.NOTION_WEBHOOK_VERIFICATION_SECRET = TEST_SECRET;
  });

  afterEach(() => {
    if (previousSecret === undefined) {
      delete process.env.NOTION_WEBHOOK_VERIFICATION_SECRET;
    } else {
      process.env.NOTION_WEBHOOK_VERIFICATION_SECRET = previousSecret;
    }
  });

  test("returns 401 without a valid webhook secret", async () => {
    const res = await POST(webhookRequest({ data: { id: "page-1" } }));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  test("returns 401 for a mismatched webhook secret", async () => {
    const res = await POST(webhookRequest({ data: { id: "page-1" } }, "wrong-secret"));
    expect(res.status).toBe(401);
  });

  test("returns 400 when data.id is missing", async () => {
    const res = await POST(webhookRequest({ data: {} }, TEST_SECRET));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Missing required field: data.id (pageId)",
    });
  });
});
