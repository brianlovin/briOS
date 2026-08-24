import { describe, expect, test } from "bun:test";

import { HOME_PROJECTS } from "@/components/home/ProjectsList";
import {
  HOW_TERMINALS_WORK_INTRO,
  HOW_TERMINALS_WORK_SECTIONS,
  HOW_TERMINALS_WORK_TITLE,
} from "@/lib/how-terminals-work";
import { INDEXABLE_SECTIONS } from "@/lib/site-copy";

describe("how terminals work copy", () => {
  test("keeps the essay title and intro", () => {
    expect(HOW_TERMINALS_WORK_TITLE).toBe("How Terminals Work");
    expect(HOW_TERMINALS_WORK_INTRO).toBe("An interactive guide to understanding terminals");
  });

  test("lists all 14 numbered sections", () => {
    expect(HOW_TERMINALS_WORK_SECTIONS).toHaveLength(14);
    expect(HOW_TERMINALS_WORK_SECTIONS.map((section) => section.title)).toEqual([
      "The Grid Model",
      "What's in a Cell?",
      "Escape Sequences",
      "Input Goes Both Ways",
      "Signals",
      "Raw vs Cooked Mode",
      "The Round Trip",
      "Building Complex TUIs",
      "The Alternate Screen Buffer",
      "Terminal Icons",
      "State Management",
      "Text Selection & Cursor Positioning",
      "Capability Discovery",
      "Terminal Vocabulary",
    ]);
  });
});

describe("indexable section", () => {
  test("omits /how-terminals-work from public section lists", () => {
    const hrefs: string[] = INDEXABLE_SECTIONS.map((section) => section.href);
    expect(hrefs).not.toContain("/how-terminals-work");
  });
});

describe("homepage project", () => {
  test("omits How Terminals Work from the homepage projects list", () => {
    expect(HOME_PROJECTS.find((item) => item.name === "How Terminals Work")).toBeUndefined();
    expect(HOME_PROJECTS.some((item) => item.href === "/how-terminals-work")).toBe(false);
  });
});
