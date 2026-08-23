import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { COMPUTER_INTRO, COMPUTER_TITLE, type ComputerTip } from "@/lib/computer";

import { ComputerCatalog } from "./ComputerCatalog";

function tip(overrides: Partial<ComputerTip> & Pick<ComputerTip, "id" | "title">): ComputerTip {
  return {
    status: "Published",
    createdTime: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("ComputerCatalog", () => {
  test("shows the title, intro, suggest control, and tip hrefs", () => {
    const html = renderToStaticMarkup(
      <ComputerCatalog
        tips={[
          tip({ id: "raycast", title: "Raycast", icon: "⌘" }),
          tip({ id: "hyperkeys", title: "Hyperkeys" }),
        ]}
      />,
    );

    expect(html).toContain(COMPUTER_TITLE);
    expect(html).toContain(COMPUTER_INTRO);
    expect(html).toContain("Suggest a tip");
    expect(html).toContain("Raycast");
    expect(html).toContain('href="/computer/raycast"');
    expect(html).toContain("Hyperkeys");
    expect(html).toContain('href="/computer/hyperkeys"');
    expect(html).not.toContain("Tip title...");
  });
});
