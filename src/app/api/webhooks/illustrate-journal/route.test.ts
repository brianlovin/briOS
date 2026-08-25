import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { NextResponse } from "next/server";

const afterMock = mock(() => {});
const generateStamp = mock(async () => {
  throw new Error("generateStamp should not run before the webhook ack");
});
const composeFieldNotePoster = mock(async () => {
  throw new Error("composeFieldNotePoster should not run before the webhook ack");
});

mock.module("next/server", () => ({
  NextResponse,
  after: afterMock,
}));

mock.module("./stamp", () => ({
  generateStamp,
  STAMP_MODEL: "test",
  referencePhotoForStamp: mock(),
}));

mock.module("./compose", () => ({
  composeFieldNotePoster,
  preparePhotoBuffer: mock(async (buffer: Buffer) => buffer),
}));

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
    afterMock.mockClear();
    generateStamp.mockClear();
    composeFieldNotePoster.mockClear();
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
    expect(afterMock).not.toHaveBeenCalled();
  });

  test("returns 401 for a mismatched webhook secret", async () => {
    const res = await POST(webhookRequest({ data: { id: "page-1" } }, "wrong-secret"));
    expect(res.status).toBe(401);
    expect(afterMock).not.toHaveBeenCalled();
  });

  test("returns 400 when data.id is missing", async () => {
    const res = await POST(webhookRequest({ data: {} }, TEST_SECRET));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Missing required field: data.id (pageId)",
    });
    expect(afterMock).not.toHaveBeenCalled();
  });

  test("acks immediately and schedules illustrate work with after()", async () => {
    const res = await POST(webhookRequest({ data: { id: "page-1" } }, TEST_SECRET));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ accepted: true, pageId: "page-1" });
    expect(afterMock).toHaveBeenCalledTimes(1);
    expect(generateStamp).not.toHaveBeenCalled();
    expect(composeFieldNotePoster).not.toHaveBeenCalled();
  });
});
