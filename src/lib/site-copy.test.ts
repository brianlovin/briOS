import { describe, expect, test } from "bun:test";

import {
  llmsTxtBody,
  markdownNotFoundBody,
  SITE_HOST,
  SITE_NAME,
  SITE_REPO,
} from "@/lib/site-copy";

describe("llms.txt", () => {
  test("names the site and lists public routes", () => {
    const body = llmsTxtBody();
    expect(body.startsWith(`# ${SITE_NAME}`)).toBe(true);
    expect(body).toContain(SITE_HOST);
    expect(body).toContain("/writing");
    expect(body).toContain("/computer");
    expect(body).toContain("/sitemap.xml");
    expect(body).toContain(SITE_REPO);
    expect(body).not.toContain("/contact");
    expect(body).not.toContain("/privacy");
  });
});

describe("markdown 404", () => {
  test("explains the miss and points at real routes", () => {
    const body = markdownNotFoundBody();
    expect(body).toContain("# Not found");
    expect(body).toContain("HTTP 404");
    expect(body).toContain("/sitemap.xml");
    expect(body).toContain("/llms.txt");
    expect(body).toContain("/writing");
    expect(body).toContain("/computer");
    expect(body).not.toContain("/contact");
    expect(body).not.toContain("/privacy");
  });
});
