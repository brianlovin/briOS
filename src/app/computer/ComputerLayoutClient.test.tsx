import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { COMPUTER_INTRO, COMPUTER_TITLE } from "@/lib/computer";

import { ComputerLayoutClient } from "./ComputerLayoutClient";

describe("ComputerLayoutClient", () => {
  test("wraps children without a sidebar header", () => {
    const html = renderToStaticMarkup(
      <ComputerLayoutClient initialTips={[]}>
        <p>catalog child</p>
      </ComputerLayoutClient>,
    );

    expect(html).toContain("catalog child");
    expect(html).not.toContain("Suggest a tip");
    expect(html).not.toContain(COMPUTER_TITLE);
    expect(html).not.toContain(COMPUTER_INTRO);
  });
});
