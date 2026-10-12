import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { installAxiomMock } from "@/lib/axiom-test-utils";

const axiomMock = installAxiomMock();

const { POST } = await import("./route");

const BROWSER_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Safari/605";

function beacon(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://brianlovin.com/api/events", {
    method: "POST",
    headers: {
      "content-type": "text/plain",
      "user-agent": BROWSER_UA,
      "sec-fetch-site": "same-origin",
      "x-forwarded-for": "198.51.100.4",
      "x-vercel-ip-country": "DE",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const outboundClick = {
  event: "outbound.clicked",
  data: { url: "https://linear.app/", item_type: "site", item_id: "abc", item_name: "Linear" },
  path: "/sites",
  referrer: "twitter.com",
};

beforeEach(() => axiomMock.enable());
afterEach(() => axiomMock.disable());

describe("POST /api/events", () => {
  test("forwards a valid client event with coarse geo and the external referrer", async () => {
    const response = await POST(beacon(outboundClick));

    expect(response.status).toBe(204);
    const [event] = axiomMock.events("outbound.clicked");
    expect(event).toMatchObject({
      url: "https://linear.app/",
      item_type: "site",
      item_name: "Linear",
      path: "/sites",
      referrer_host: "twitter.com",
      country: "DE",
      source: "client",
      is_bot: false,
    });
    expect(typeof event.visitor).toBe("string");
    expect(JSON.stringify(event)).not.toContain("198.51.100.4");
  });

  test("rejects unknown events and unexpected fields", async () => {
    const unknown = await POST(beacon({ ...outboundClick, event: "page.viewed" }));
    const extraField = await POST(
      beacon({ ...outboundClick, data: { ...outboundClick.data, email: "x@y.z" } }),
    );
    const notJson = await POST(beacon("{nope"));

    expect([unknown.status, extraField.status, notJson.status]).toEqual([400, 400, 400]);
    expect(axiomMock.events("outbound.clicked")).toHaveLength(0);
  });

  test("drops bots and cross-site posts without recording them", async () => {
    const bot = await POST(beacon(outboundClick, { "user-agent": "Googlebot/2.1" }));
    const crossSite = await POST(beacon(outboundClick, { "sec-fetch-site": "cross-site" }));

    expect([bot.status, crossSite.status]).toEqual([204, 204]);
    expect(axiomMock.events("outbound.clicked")).toHaveLength(0);
  });

  test("successful beacons do not add an api.request summary", async () => {
    await POST(beacon(outboundClick));

    expect(axiomMock.events("api.request")).toHaveLength(0);
  });
});
