import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import PrivacyPage from "./page";

describe("privacy page", () => {
  test("describes what this personal site actually collects", () => {
    const html = renderToStaticMarkup(<PrivacyPage />);
    const text = html.replace(/<[^>]+>/g, " ");

    expect(html).toContain("Privacy");
    expect(text.length).toBeGreaterThan(500);
    expect(html).toContain("Fathom");
    expect(html).toContain("likes");
    expect(html).toContain("activity");
    expect(html).toContain('href="/contact"');
  });
});
