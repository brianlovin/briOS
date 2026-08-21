import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import NotFound from "./not-found";

describe("not-found", () => {
  test("shows the 404 copy and links back home", () => {
    const html = renderToStaticMarkup(<NotFound />);

    expect(html).toContain("404");
    expect(html).toContain("You have found yourself in quite a situation");
    expect(html).toContain("Back home");
    expect(html).toContain('href="/"');
  });
});
