import { describe, expect, test } from "bun:test";

import { HOME_PROJECTS } from "@/components/home/ProjectsList";
import { COMPUTER_INTRO, COMPUTER_TITLE, type ComputerTip, computerTipLinks } from "@/lib/computer";
import { INDEXABLE_SECTIONS } from "@/lib/site-copy";

function tip(overrides: Partial<ComputerTip> & Pick<ComputerTip, "id" | "title">): ComputerTip {
  return {
    status: "Published",
    createdTime: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("computer copy and links", () => {
  test("keeps the catalog title and intro", () => {
    expect(COMPUTER_TITLE).toBe("How to Computer Better");
    expect(COMPUTER_INTRO).toBe(
      "This is a living list of tips to use computers better: shortcuts, hotkeys, utility apps, helpful workflows, and so on.",
    );
  });

  test("lists published tip titles and hrefs", () => {
    expect(
      computerTipLinks([
        tip({ id: "raycast", title: "Raycast" }),
        tip({ id: "hyperkeys", title: "Hyperkeys" }),
      ]),
    ).toEqual([
      { id: "raycast", title: "Raycast", href: "/computer/raycast" },
      { id: "hyperkeys", title: "Hyperkeys", href: "/computer/hyperkeys" },
    ]);
  });
});

describe("indexable section", () => {
  test("includes /computer in public section lists", () => {
    expect(INDEXABLE_SECTIONS.some((section) => section.href === "/computer")).toBe(true);
  });
});

describe("homepage project", () => {
  test("points How to Computer Better at the native /computer route", () => {
    const project = HOME_PROJECTS.find((item) => item.name === "How to Computer Better");
    expect(project).toEqual({
      name: "How to Computer Better",
      href: "/computer",
      description: "How to use a computer better",
      external: false,
    });
  });
});
