import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { nextSlotOffset, SlotDigits } from "@/components/SlotDigits";

describe("nextSlotOffset", () => {
  test("steps forward without wrapping", () => {
    expect(nextSlotOffset(1, 2)).toBe(2);
    expect(nextSlotOffset(6, 6)).toBe(6);
    expect(nextSlotOffset(0, 9)).toBe(9);
  });

  test("wraps 9 → 0 onto the duplicate 0", () => {
    expect(nextSlotOffset(9, 0)).toBe(10);
  });
});

describe("SlotDigits", () => {
  test("clips a 2D stack to the current digit", () => {
    const markup = renderToStaticMarkup(<SlotDigits value={6} />);

    expect(markup).toContain("data-slot-digits");
    expect(markup).toContain("overflow-hidden");
    expect(markup).toContain("h-[1em]");
    expect(markup).toContain("translateY(-6em)");
    expect(markup).toContain(">6<");
    expect(markup).not.toContain("preserve-3d");
    expect(markup).not.toContain("translateZ");
    expect(markup).not.toContain("rotateX");
    expect(markup).not.toContain("<div");
  });

  test("renders one column per digit", () => {
    const markup = renderToStaticMarkup(<SlotDigits value={16} />);

    expect(markup.match(/data-slot-digit/g)?.length).toBe(2);
    expect(markup).toContain("translateY(-1em)");
    expect(markup).toContain("translateY(-6em)");
  });
});
