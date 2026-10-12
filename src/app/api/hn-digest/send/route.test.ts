import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { readFileSync } from "fs";
import * as nextServer from "next/server";
import { resolve } from "path";

import { installAxiomMock } from "@/lib/axiom-test-utils";

const axiomMock = installAxiomMock();

type BatchResult = { ErrorCode: number; Message: string; To?: string };
type BatchMessage = { To: string };

const sendEmailBatchWithTemplates = mock(
  async (messages: BatchMessage[]): Promise<BatchResult[]> =>
    messages.map((message) => ({ ErrorCode: 0, Message: "OK", To: message.To })),
);

mock.module("postmark", () => ({
  ServerClient: class {
    sendEmailBatchWithTemplates = sendEmailBatchWithTemplates;
  },
}));

const subscribers = ["a@example.com", "b@example.com", "c@example.com"];
const getHNSubscribers = mock(async () => subscribers);

mock.module("@/lib/subscriptions", () => ({
  createSubscription: mock(async () => ({ success: true, alreadyExists: false })),
  deleteSubscription: mock(async () => true),
  getHNSubscribers,
}));

const post = (id: number) => ({
  id,
  title: `Post ${id}`,
  type: "link",
  url: `https://example.com/${id}`,
  domain: "example.com",
  points: 100,
  user: "pg",
  time: Math.floor(Date.now() / 1000),
  comments_count: 3,
});
const getHNPostsForDigest = mock(async () => [post(1), post(2)]);
const actualHN = await import("@/lib/hn");

mock.module("@/lib/hn", () => ({ ...actualHN, getHNPostsForDigest }));

mock.module("@/lib/activity-redis", () => ({
  getActivityStore: () => null,
}));

mock.module("next/server", () => ({
  ...nextServer,
  connection: async () => {},
  after: () => {
    throw new Error("`after` was called outside a request scope");
  },
}));

const CRON_SECRET = "test-cron-secret";
process.env.CRON_SECRET = CRON_SECRET;
process.env.JWT_SIGNING_KEY ||= "test-jwt-signing-key";
process.env.POSTMARK_CLIENT_ID ||= "test-postmark-token";

// The route only sends to every subscriber in production.
const previousNodeEnv = process.env.NODE_ENV;
Object.assign(process.env, { NODE_ENV: "production" });
const { GET } = await import("./route");
Object.assign(process.env, { NODE_ENV: previousNodeEnv });

function cronRequest(secret = CRON_SECRET) {
  return new Request("https://brianlovin.com/api/hn-digest/send", {
    headers: { authorization: `Bearer ${secret}` },
  });
}

describe("GET /api/hn-digest/send", () => {
  test("opts the cron into request-time rendering without cacheComponents-incompatible segment configs", () => {
    const source = readFileSync(resolve(import.meta.dir, "route.ts"), "utf8");

    expect(source).not.toMatch(/export const dynamic/);
    expect(source).not.toMatch(/export const revalidate/);
    expect(source).toMatch(/await connection\(\)/);
    expect(source).toContain("Cache-Control");
    expect(source).toContain("no-store");
  });
});

describe("GET /api/hn-digest/send events", () => {
  beforeEach(() => {
    axiomMock.enable();
    sendEmailBatchWithTemplates.mockClear();
    getHNPostsForDigest.mockClear();
  });

  afterEach(() => axiomMock.disable());

  test("a clean run emits hn.digest.run with every subscriber sent", async () => {
    const response = await GET(cronRequest());

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ emailsSent: 3, failures: 0 });

    const runs = axiomMock.events("hn.digest.run");
    expect(runs).toHaveLength(1);
    expect(runs[0]).toMatchObject({
      total_subscribers: 3,
      sent: 3,
      failed: 0,
      post_count: 2,
      status: "success",
    });
    expect(typeof runs[0].duration_ms).toBe("number");
    expect(axiomMock.events("hn.digest.send_failed")).toHaveLength(0);
    expect(axiomMock.events("cron.completed")[0]).toMatchObject({
      job: "hn-digest",
      status: 200,
      sent: 3,
    });
  });

  test("Postmark rejections emit one hn.digest.send_failed per address and a partial run", async () => {
    sendEmailBatchWithTemplates.mockImplementationOnce(async (messages) =>
      messages.map((message) =>
        message.To === "b@example.com"
          ? { ErrorCode: 406, Message: "Address is inactive.", To: message.To }
          : { ErrorCode: 0, Message: "OK", To: message.To },
      ),
    );

    await GET(cronRequest());

    expect(axiomMock.events("hn.digest.run")[0]).toMatchObject({
      total_subscribers: 3,
      sent: 2,
      failed: 1,
      status: "partial",
    });
    const failures = axiomMock.events("hn.digest.send_failed");
    expect(failures).toHaveLength(1);
    expect(failures[0]).toMatchObject({
      email: "b@example.com",
      postmark_error_code: 406,
      postmark_message: "Address is inactive.",
    });
  });

  test("a failed batch counts every address in it as failed", async () => {
    sendEmailBatchWithTemplates.mockImplementationOnce(async () => {
      throw Object.assign(new Error("Server error"), { code: 500, statusCode: 500 });
    });

    await GET(cronRequest());

    expect(axiomMock.events("hn.digest.run")[0]).toMatchObject({
      total_subscribers: 3,
      sent: 0,
      failed: 3,
      status: "failed",
    });
    const failures = axiomMock.events("hn.digest.send_failed");
    expect(failures.map((event) => event.email)).toEqual(subscribers);
    expect(failures[0]).toMatchObject({ http_status: 500, postmark_message: "Server error" });
    expect(axiomMock.events("hn.digest.batch")[0]).toMatchObject({
      status: "error",
      batch_size: 3,
    });
  });

  test("a day with no posts emits a no_posts run without sending", async () => {
    getHNPostsForDigest.mockImplementationOnce(async () => []);

    await GET(cronRequest());

    expect(sendEmailBatchWithTemplates).not.toHaveBeenCalled();
    expect(axiomMock.events("hn.digest.run")[0]).toMatchObject({
      status: "no_posts",
      sent: 0,
    });
  });

  test("an unauthorized request sends nothing and records no digest run", async () => {
    const response = await GET(cronRequest("wrong-secret"));

    expect(response.status).toBe(401);
    expect(getHNPostsForDigest).not.toHaveBeenCalled();
    expect(axiomMock.events("hn.digest.run")).toHaveLength(0);
    expect(axiomMock.events("cron.completed")[0]).toMatchObject({ status: 401 });
  });
});
