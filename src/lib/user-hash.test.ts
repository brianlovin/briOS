import { describe, expect, test } from "bun:test";

import { getClientIp, getClientIpFromHeaders, hashUserIp } from "@/lib/user-hash";

describe("hashUserIp", () => {
  test("returns a 16-character hex string", () => {
    const hash = hashUserIp("1.2.3.4");
    expect(hash).toHaveLength(16);
    expect(hash).toMatch(/^[0-9a-f]{16}$/);
  });

  test("is deterministic for the same ip", () => {
    expect(hashUserIp("1.2.3.4")).toBe(hashUserIp("1.2.3.4"));
  });

  test("produces different hashes for different ips", () => {
    expect(hashUserIp("1.2.3.4")).not.toBe(hashUserIp("5.6.7.8"));
  });
});

function requestWith(headers: Record<string, string>): Request {
  return new Request("https://example.com", { headers });
}

describe("getClientIp", () => {
  test("prefers the Cloudflare header", () => {
    const req = requestWith({
      "cf-connecting-ip": "9.9.9.9",
      "x-forwarded-for": "1.1.1.1",
      "x-real-ip": "2.2.2.2",
    });
    expect(getClientIp(req)).toBe("9.9.9.9");
  });

  test("falls back to the first x-forwarded-for entry", () => {
    const req = requestWith({ "x-forwarded-for": "1.1.1.1, 2.2.2.2, 3.3.3.3" });
    expect(getClientIp(req)).toBe("1.1.1.1");
  });

  test("trims whitespace from x-forwarded-for", () => {
    const req = requestWith({ "x-forwarded-for": "  4.4.4.4 , 5.5.5.5" });
    expect(getClientIp(req)).toBe("4.4.4.4");
  });

  test("falls back to x-real-ip", () => {
    const req = requestWith({ "x-real-ip": "2.2.2.2" });
    expect(getClientIp(req)).toBe("2.2.2.2");
  });

  test("returns 'unknown' when no ip headers are present", () => {
    expect(getClientIp(requestWith({}))).toBe("unknown");
  });
});

describe("getClientIpFromHeaders", () => {
  function headersFrom(map: Record<string, string>) {
    return { get: (name: string) => map[name] ?? null };
  }

  test("prefers the Cloudflare header", () => {
    const headers = headersFrom({
      "cf-connecting-ip": "9.9.9.9",
      "x-forwarded-for": "1.1.1.1",
    });
    expect(getClientIpFromHeaders(headers)).toBe("9.9.9.9");
  });

  test("falls back through x-forwarded-for then x-real-ip", () => {
    expect(getClientIpFromHeaders(headersFrom({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" }))).toBe(
      "1.1.1.1",
    );
    expect(getClientIpFromHeaders(headersFrom({ "x-real-ip": "2.2.2.2" }))).toBe("2.2.2.2");
  });

  test("returns 'unknown' when nothing is present", () => {
    expect(getClientIpFromHeaders(headersFrom({}))).toBe("unknown");
  });
});
