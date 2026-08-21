import { describe, expect, test } from "bun:test";

import { GET } from "./route";

describe("/llms.txt", () => {
  test("returns markdown with the site name and when-to-use section", async () => {
    const response = GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
    const body = await response.text();
    expect(body).toContain("# Brian Lovin");
    expect(body).toContain("## When to use this");
    expect(body).toContain("/sitemap.xml");
  });
});
