import { describe, expect, test } from "bun:test";

import { notFoundMarkdown, renderPageMarkdown } from "@/lib/page-markdown";
import { markdownResponse } from "@/lib/page-markdown-response";

describe("markdownResponse", () => {
  test("homepage markdown is real content with the expected headers", async () => {
    const response = markdownResponse(await renderPageMarkdown("/"));
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
    expect(response.headers.get("Vary")).toBe("Accept");
    const body = await response.text();
    expect(body).toContain("# Brian Lovin");
    expect(body).toContain("## Writing");
  });

  test("unknown paths are HTTP 404 markdown", async () => {
    const response = markdownResponse(notFoundMarkdown());
    expect(response.status).toBe(404);
    expect(response.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
    expect(response.headers.get("Vary")).toBe("Accept");
    const body = await response.text();
    expect(body).toContain("Not found");
    expect(body).toContain("/sitemap.xml");
  });
});
