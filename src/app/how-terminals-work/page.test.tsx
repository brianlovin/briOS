import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { HOW_TERMINALS_WORK_INTRO, HOW_TERMINALS_WORK_TITLE } from "@/lib/how-terminals-work";

import { HowTerminalsWorkGuide } from "./HowTerminalsWorkGuide";
import HowTerminalsWorkPage from "./page";

describe("How Terminals Work page", () => {
  test("renders the essay title, intro, and every section heading", () => {
    const html = renderToStaticMarkup(<HowTerminalsWorkPage />);
    expect(html).toContain("<h1");
    expect(html).toContain(HOW_TERMINALS_WORK_TITLE);
    expect(html).toContain(HOW_TERMINALS_WORK_INTRO);

    const guide = renderToStaticMarkup(<HowTerminalsWorkGuide />);
    expect(guide).toContain("The Grid Model");
    expect(guide).toContain("What's in a Cell?");
    expect(guide).toContain("Escape Sequences");
    expect(guide).toContain("Input Goes Both Ways");
    expect(guide).toContain("Signals");
    expect(guide).toContain("Raw vs Cooked Mode");
    expect(guide).toContain("The Round Trip");
    expect(guide).toContain("Building Complex TUIs");
    expect(guide).toContain("The Alternate Screen Buffer");
    expect(guide).toContain("Terminal Icons");
    expect(guide).toContain("State Management");
    expect(guide).toContain("Text Selection &amp; Cursor Positioning");
    expect(guide).toContain("Capability Discovery");
    expect(guide).toContain("Terminal Vocabulary");
    expect(guide).toContain("Press any key");
    expect(guide).toContain("^[[?1049h");
  });
});
