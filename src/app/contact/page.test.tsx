import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import ContactPage from "./page";

describe("contact page", () => {
  test("lists the public channels already on the site", () => {
    const html = renderToStaticMarkup(<ContactPage />);
    const text = html.replace(/<[^>]+>/g, " ");

    expect(html).toContain("Contact");
    expect(text.length).toBeGreaterThan(500);
    expect(html).toContain("https://x.com/brian_lovin");
    expect(html).toContain("https://github.com/brianlovin");
    expect(html).toContain("https://www.youtube.com/@brian_lovin");
    expect(html).toContain('href="/ama"');
    expect(html).toContain("https://github.com/brianlovin/briOS");
    expect(html).toContain('href="/privacy"');
    expect(html).not.toContain("tel:");
  });
});
