import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";

import { installAxiomMock } from "@/lib/axiom-test-utils";

const axiomMock = installAxiomMock();

const createSubscription = mock(async () => ({ success: true, alreadyExists: false }));

mock.module("@/lib/subscriptions", () => ({
  createSubscription,
  deleteSubscription: mock(async () => true),
  getHNSubscribers: mock(async () => []),
}));

mock.module("@/lib/activity-redis", () => ({
  getActivityStore: () => null,
}));

const { POST } = await import("./route");

function subscribeRequest(body: unknown) {
  return new Request("https://brianlovin.com/api/hn-digest/subscribe", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Safari/605",
      "x-forwarded-for": "203.0.113.9",
      "x-vercel-ip-country": "US",
      "x-vercel-ip-country-region": "CA",
      referer: "https://news.ycombinator.com/item?id=1",
    },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  axiomMock.enable();
  createSubscription.mockClear();
});

afterEach(() => axiomMock.disable());

describe("POST /api/hn-digest/subscribe events", () => {
  test("a new subscriber emits hn.subscribed with coarse geo and no raw IP", async () => {
    const response = await POST(subscribeRequest({ email: "new@example.com" }));

    expect(response.status).toBe(200);
    const events = axiomMock.events("hn.subscribed");
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      email: "new@example.com",
      source: "web",
      country: "US",
      region: "CA",
      referrer_host: "news.ycombinator.com",
      is_bot: false,
    });
    expect(JSON.stringify(axiomMock.events())).not.toContain("203.0.113.9");
    expect(axiomMock.events("hn.subscribe_rejected")).toHaveLength(0);
  });

  test("an existing subscriber emits hn.subscribe_rejected, not hn.subscribed", async () => {
    createSubscription.mockImplementationOnce(async () => ({
      success: false,
      alreadyExists: true,
    }));

    const response = await POST(subscribeRequest({ email: "old@example.com" }));

    expect(response.status).toBe(409);
    expect(axiomMock.events("hn.subscribed")).toHaveLength(0);
    expect(axiomMock.events("hn.subscribe_rejected")[0]).toMatchObject({
      reason: "already_subscribed",
      email: "old@example.com",
    });
  });

  test("an invalid email is rejected without storing or logging the address", async () => {
    const response = await POST(subscribeRequest({ email: "not-an-email" }));

    expect(response.status).toBe(400);
    expect(createSubscription).not.toHaveBeenCalled();
    const [rejected] = axiomMock.events("hn.subscribe_rejected");
    expect(rejected).toMatchObject({ reason: "invalid_email" });
    expect(rejected.email).toBeUndefined();
  });

  test("the request summary is emitted and flushed", async () => {
    await POST(subscribeRequest({ email: "new@example.com" }));

    expect(axiomMock.events("api.request")[0]).toMatchObject({
      route: "/api/hn-digest/subscribe",
      method: "POST",
      status: 200,
    });
    expect(axiomMock.flush).toHaveBeenCalled();
  });
});
