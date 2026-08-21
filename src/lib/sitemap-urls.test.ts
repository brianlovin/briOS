import { describe, expect, test } from "bun:test";

import { SITE_CONFIG } from "@/lib/metadata";
import { buildSitemapEntries } from "@/lib/sitemap-urls";

describe("buildSitemapEntries", () => {
  test("lists indexable public URLs with lastmod and skips blocked paths", async () => {
    const entries = await buildSitemapEntries();
    const urls = entries.map((item) => item.url);

    expect(urls).toContain(`${SITE_CONFIG.url}/`);
    expect(urls).toContain(`${SITE_CONFIG.url}/writing`);
    expect(urls).toContain(`${SITE_CONFIG.url}/about`);
    expect(urls).toContain(`${SITE_CONFIG.url}/contact`);
    expect(urls).toContain(`${SITE_CONFIG.url}/privacy`);
    expect(urls).toContain(`${SITE_CONFIG.url}/llms.txt`);
    expect(urls).not.toContain(`${SITE_CONFIG.url}/dev`);
    expect(urls).not.toContain(`${SITE_CONFIG.url}/activity/sandbox`);
    expect(urls.some((item) => item.includes("/api/"))).toBe(false);

    for (const item of entries) {
      expect(item.lastModified).toBeInstanceOf(Date);
    }
  });
});
