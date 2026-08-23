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
  test("shows the title, intro, and tip hrefs", () => {
    const html = renderToStaticMarkup(
      <ComputerCatalog
        tips={[
          tip({ id: "raycast", title: "Raycast", shortId: "hwmX1CS", icon: "⌘" }),
          tip({ id: "hyperkeys", title: "Hyperkeys", shortId: "me9hIdP" }),
          tip({ id: "draft", title: "Hidden without short id" }),
        ]}
      />,
    );

    expect(html).toContain(COMPUTER_TITLE);
    expect(html).toContain(COMPUTER_INTRO);
    expect(html).not.toContain("Suggest a tip");
    expect(html).toContain("Raycast");
    expect(html).toContain('href="/computer/raycast-hwmX1CS"');
    expect(html).toContain("Hyperkeys");
    expect(html).toContain('href="/computer/hyperkeys-me9hIdP"');
    expect(html).not.toContain("Hidden without short id");
    expect(html).not.toContain("/computer/draft");
  });
});
