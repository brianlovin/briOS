import { describe, expect, test } from "bun:test";

import {
  CONTACT_PARAGRAPHS,
  countCopyCharacters,
  llmsTxtBody,
  markdownNotFoundBody,
  PRIVACY_PARAGRAPHS,
  SITE_HOST,
  SITE_NAME,
  SITE_PRODUCT,
  SITE_REPO,
} from "@/lib/site-copy";

describe("trust page copy", () => {
  test("contact and privacy are substantial and honest", () => {
    expect(countCopyCharacters(CONTACT_PARAGRAPHS)).toBeGreaterThanOrEqual(500);
    expect(countCopyCharacters(PRIVACY_PARAGRAPHS)).toBeGreaterThanOrEqual(500);
    expect(CONTACT_PARAGRAPHS.join(" ")).toContain("X");
    expect(CONTACT_PARAGRAPHS.join(" ")).toContain("GitHub");
    expect(CONTACT_PARAGRAPHS.join(" ")).not.toContain("555-");
    expect(PRIVACY_PARAGRAPHS.join(" ")).toContain("Fathom");
    expect(PRIVACY_PARAGRAPHS.join(" ")).toContain("likes");
  });
});

describe("llms.txt", () => {
  test("names the site and says when to use it", () => {
    const body = llmsTxtBody();
    expect(body.startsWith(`# ${SITE_NAME}`)).toBe(true);
    expect(body).toContain(SITE_PRODUCT);
    expect(body).toContain(SITE_HOST);
    expect(body).toContain("## When to use this");
    expect(body).toContain("Accept: text/markdown");
    expect(body).toContain("/sitemap.xml");
    expect(body).toContain("/writing");
    expect(body).toContain(SITE_REPO);
    expect(body).toContain("not a SaaS");
    expect(body).toContain("no public machine API");
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
    expect(body).toContain(SITE_HOST);
  });
});
