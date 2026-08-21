import { describe, expect, test } from "bun:test";

import robots from "./robots";

function ruleFor(result: ReturnType<typeof robots>, userAgent: string) {
  const list = Array.isArray(result.rules) ? result.rules : [result.rules];
  return list.find((rule) => {
    const agents = Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent ?? "*"];
    return agents.includes(userAgent);
  });
}

describe("robots", () => {
  test("allows * on / and disallows /api/, and points at the sitemap", () => {
    const result = robots();
    const wildcard = ruleFor(result, "*");

    expect(wildcard?.allow).toBe("/");
    expect(wildcard?.disallow).toBe("/api/");
    expect(wildcard?.disallow).not.toBe("/");
    expect(result.sitemap).toBe("https://brianlovin.com/sitemap.xml");
  });

  test("allows Googlebot / and disallows GPTBot /", () => {
    const result = robots();

    expect(ruleFor(result, "Googlebot")?.allow).toBe("/");
    expect(ruleFor(result, "GPTBot")?.disallow).toBe("/");
  });
});
