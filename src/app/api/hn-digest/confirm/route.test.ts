import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";

import { installAxiomMock } from "@/lib/axiom-test-utils";

const axiomMock = installAxiomMock();

process.env.JWT_SIGNING_KEY ||= "test-jwt-signing-key";

const createSubscription = mock((async () => ({ success: true, alreadyExists: false })) as (
  email: string,
) => Promise<{ success: boolean; alreadyExists: boolean }>);

mock.module("@/lib/subscriptions", () => ({
  createSubscription,
  normalizeEmail: (email: string) => email.trim().toLowerCase(),
}));

mock.module("@/lib/activity-redis", () => ({
  getActivityStore: () => null,
}));

const { GET } = await import("./route");
const { generateSubscribeConfirmToken, generateUnsubscribeToken } = await import("@/lib/jwt");

function confirmRequest(token?: string) {
  const query = token ? `?token=${encodeURIComponent(token)}` : "";
  return new Request(`https://brianlovin.com/api/hn-digest/confirm${query}`);
}

beforeEach(() => {
  axiomMock.enable();
  createSubscription.mockClear();
});

afterEach(() => axiomMock.disable());

describe("GET /api/hn-digest/confirm", () => {
  test("a valid confirmation token subscribes the address", async () => {
    const res = await GET(confirmRequest(generateSubscribeConfirmToken("new@example.com")));

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/hn?subscribed=1");
    expect(createSubscription).toHaveBeenCalledWith("new@example.com");
    expect(axiomMock.events("hn.subscribed")[0]).toMatchObject({ email: "new@example.com" });
  });

  test("an unsubscribe token cannot be used to subscribe someone", async () => {
    const res = await GET(confirmRequest(generateUnsubscribeToken("victim@example.com")));

    expect(res.headers.get("location")).toContain("/hn?subscribe=invalid");
    expect(createSubscription).not.toHaveBeenCalled();
  });

  test("missing or forged tokens are rejected", async () => {
    await GET(confirmRequest());
    await GET(confirmRequest("not-a-jwt"));
    expect(createSubscription).not.toHaveBeenCalled();
    expect(axiomMock.events("hn.subscribe_confirm_failed")).toHaveLength(2);
  });
});
