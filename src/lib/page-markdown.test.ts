import { describe, expect, test } from "bun:test";

import { notFoundMarkdown, renderPageMarkdown } from "@/lib/page-markdown";
import { SITE_NAME } from "@/lib/site-copy";

describe("renderPageMarkdown", () => {
  test("homepage markdown has a title, headings, and section links", async () => {
    const result = await renderPageMarkdown("/");
    expect(result.status).toBe(200);
    expect(result.body).toContain(`# ${SITE_NAME}`);
    expect(result.body).toContain("## Writing");
    expect(result.body).toContain("## Projects");
    expect(result.body).toContain("/writing");
    expect(result.body).toContain("/stack");
    expect(result.body.length).toBeGreaterThan(500);
    expect(result.cacheTags).toContain("notion:writing");
  });

  test("static trust pages return real markdown", async () => {
    const about = await renderPageMarkdown("/about");
    const contact = await renderPageMarkdown("/contact");
    const privacy = await renderPageMarkdown("/privacy");

    expect(about.status).toBe(200);
    expect(about.body).toContain("# About");
    expect(contact.status).toBe(200);
    expect(contact.body).toContain("# Contact");
    expect(contact.body).toContain("https://x.com/brian_lovin");
    expect(privacy.status).toBe(200);
    expect(privacy.body).toContain("# Privacy");
    expect(privacy.body).toContain("Fathom");
  });

  test("unknown paths return 404 markdown that can recover", async () => {
    const result = await renderPageMarkdown("/some-path-that-does-not-exist");
    expect(result.status).toBe(404);
    expect(result.body).toBe(notFoundMarkdown().body);
    expect(result.body).toContain("/sitemap.xml");
    expect(result.body).toContain("/llms.txt");
  });
});
