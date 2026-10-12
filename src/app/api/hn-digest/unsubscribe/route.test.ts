import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";

import { installAxiomMock } from "@/lib/axiom-test-utils";

const axiomMock = installAxiomMock();

const deleteSubscription = mock(async () => true);

mock.module("@/lib/subscriptions", () => ({
  createSubscription: mock(async () => ({ success: true, alreadyExists: false })),
  deleteSubscription,
  getHNSubscribers: mock(async () => []),
}));

process.env.JWT_SIGNING_KEY ||= "test-jwt-signing-key";

const { generateUnsubscribeToken } = await import("@/lib/jwt");
const { BASE_URL } = await import("@/lib/urls");
const { GET } = await import("./route");

const BROWSER_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148";

function unsubscribeRequest(token?: string, userAgent = BROWSER_UA) {
  const query = token === undefined ? "" : `?token=${encodeURIComponent(token)}`;
  return new Request(`https://brianlovin.com/api/hn-digest/unsubscribe${query}`, {
    headers: { "user-agent": userAgent },
  });
}

beforeEach(() => {
  axiomMock.enable();
  deleteSubscription.mockClear();
});

afterEach(() => axiomMock.disable());

describe("GET /api/hn-digest/unsubscribe events", () => {
  test("one click unsubscribes, redirects to /hn, and emits hn.unsubscribed", async () => {
    const response = await GET(unsubscribeRequest(generateUnsubscribeToken("reader@example.com")));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(`${BASE_URL}/hn`);
    expect(deleteSubscription).toHaveBeenCalledWith("reader@example.com");

    const events = axiomMock.events("hn.unsubscribed");
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      email: "reader@example.com",
      source: "email_link",
      user_agent: BROWSER_UA,
      is_bot: false,
    });
  });

  test("link scanners are flagged as bots so they can be filtered out", async () => {
    await GET(
      unsubscribeRequest(
        generateUnsubscribeToken("reader@example.com"),
        "Barracuda URL scanner bot",
      ),
    );

    expect(axiomMock.events("hn.unsubscribed")[0]).toMatchObject({ is_bot: true });
  });

  test("an unknown subscriber still redirects and emits hn.unsubscribe_failed", async () => {
    deleteSubscription.mockImplementationOnce(async () => false);

    const response = await GET(unsubscribeRequest(generateUnsubscribeToken("gone@example.com")));

    expect(response.headers.get("location")).toBe(`${BASE_URL}/hn`);
    expect(axiomMock.events("hn.unsubscribed")).toHaveLength(0);
    expect(axiomMock.events("hn.unsubscribe_failed")[0]).toMatchObject({
      reason: "not_found",
      email: "gone@example.com",
    });
  });

  test("bad or missing tokens redirect without deleting anything", async () => {
    const invalid = await GET(unsubscribeRequest("not-a-jwt"));
    const missing = await GET(unsubscribeRequest());

    expect(invalid.headers.get("location")).toBe(`${BASE_URL}/hn`);
    expect(missing.headers.get("location")).toBe(`${BASE_URL}/hn`);
    expect(deleteSubscription).not.toHaveBeenCalled();
    expect(axiomMock.events("hn.unsubscribe_failed").map((event) => event.reason)).toEqual([
      "invalid_token",
      "missing_token",
    ]);
  });
});
