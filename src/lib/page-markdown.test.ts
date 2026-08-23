import { describe, expect, test } from "bun:test";

import { notFoundMarkdown, renderPageMarkdown } from "@/lib/page-markdown";
import { SITE_NAME } from "@/lib/site-copy";

describe("renderPageMarkdown", () => {
  test("homepage markdown has a title, headings, and section links", async () => {
    const result = await renderPageMarkdown("/");
    expect(result.status).toBe(200);
    expect(result.body).toContain(`# ${SITE_NAME}`);
    expect(result.body).toContain("## Writing");
    expect(result.body).toContain("/writing");
    expect(result.cacheTags).toContain("notion:writing");
  });

  test("about markdown exists and does not invent contact or privacy pages", async () => {
    const about = await renderPageMarkdown("/about");
    expect(about.status).toBe(200);
    expect(about.body).toContain("# About");
    expect(about.body).not.toContain("/contact");
    expect(about.body).not.toContain("/privacy");
  });

  test("computer index uses the catalog title and intro", async () => {
    const result = await renderPageMarkdown("/computer");
    expect(result.status).toBe(200);
    expect(result.body).toContain("# How to Computer Better");
    expect(result.body).toContain(
      "This is a living list of tips to use computers better: shortcuts, hotkeys, utility apps, helpful workflows, and so on.",
    );
    expect(result.cacheTags).toContain("notion:computer");
  });

  test("unknown paths return 404 markdown", async () => {
    const result = await renderPageMarkdown("/some-path-that-does-not-exist");
    expect(result.status).toBe(404);
    expect(result.body).toBe(notFoundMarkdown().body);
    expect(result.body).toContain("/sitemap.xml");
  });
});
