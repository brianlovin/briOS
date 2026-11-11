import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";

import { installAxiomMock } from "@/lib/axiom-test-utils";

const axiomMock = installAxiomMock();

process.env.JWT_SIGNING_KEY ||= "test-jwt-signing-key";

const createSubscription = mock(async () => ({ success: true, alreadyExists: false }));
const isSubscribed = mock((async () => false) as (email: string) => Promise<boolean>);
const claimConfirmationSend = mock((async () => true) as (email: string) => Promise<boolean>);
const sendHNConfirmationEmail = mock((async () => {}) as (
  to: string,
  url: string,
) => Promise<void>);

mock.module("@/lib/subscriptions", () => ({
  createSubscription,
  isSubscribed,
  claimConfirmationSend,
  normalizeEmail: (email: string) => email.trim().toLowerCase(),
  deleteSubscription: mock(async () => true),
  getHNSubscribers: mock(async () => []),
}));

mock.module("@/lib/email", () => ({ sendHNConfirmationEmail }));

const { POST } = await import("./route");
const { verifySubscribeConfirmToken } = await import("@/lib/jwt");

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
  for (const m of [
    createSubscription,
    isSubscribed,
    claimConfirmationSend,
    sendHNConfirmationEmail,
  ]) {
    m.mockClear();
  }
});

afterEach(() => axiomMock.disable());

describe("POST /api/hn-digest/subscribe (double opt-in)", () => {
  test("a new address gets a confirmation email and is not subscribed yet", async () => {
    const response = await POST(subscribeRequest({ email: " New@Example.com " }));

    expect(response.status).toBe(200);
    expect(createSubscription).not.toHaveBeenCalled();
    expect(sendHNConfirmationEmail).toHaveBeenCalledTimes(1);
    const [to, url] = sendHNConfirmationEmail.mock.calls[0];
    expect(to).toBe("new@example.com");
    const token = new URL(url).searchParams.get("token")!;
    expect(verifySubscribeConfirmToken(token)).toBe("new@example.com");

    const [pending] = axiomMock.events("hn.subscribe_pending");
    expect(pending).toMatchObject({ email: "new@example.com", source: "web", country: "US" });
    expect(JSON.stringify(axiomMock.events())).not.toContain("203.0.113.9");
    expect(axiomMock.events("hn.subscribed")).toHaveLength(0);
  });

  test("an existing subscriber gets the same response and no email", async () => {
    isSubscribed.mockImplementationOnce(async () => true);
    const existing = await POST(subscribeRequest({ email: "old@example.com" }));
    const fresh = await POST(subscribeRequest({ email: "new@example.com" }));

    expect(existing.status).toBe(fresh.status);
    expect(await existing.json()).toEqual(await fresh.json());
    expect(sendHNConfirmationEmail).toHaveBeenCalledTimes(1);
    expect(axiomMock.events("hn.subscribe_rejected")[0]).toMatchObject({
      reason: "already_subscribed",
      email: "old@example.com",
    });
  });

  test("repeat requests within the cooldown do not send another email", async () => {
    claimConfirmationSend.mockImplementationOnce(async () => false);
    const response = await POST(subscribeRequest({ email: "victim@example.com" }));

    expect(response.status).toBe(200);
    expect(sendHNConfirmationEmail).not.toHaveBeenCalled();
    expect(axiomMock.events("hn.subscribe_rejected")[0]).toMatchObject({
      reason: "confirmation_throttled",
    });
  });

  test("an invalid email is rejected without storing or logging the address", async () => {
    const response = await POST(subscribeRequest({ email: "not-an-email" }));

    expect(response.status).toBe(400);
    expect(sendHNConfirmationEmail).not.toHaveBeenCalled();
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
