import { describe, expect, test } from "bun:test";

import { generate256Colors, hslToRgb, parseAnsiLine } from "./ansi";

describe("parseAnsiLine", () => {
  test("keeps plain text without a color", () => {
    expect(parseAnsiLine("$ ls")).toEqual([{ text: "$ ls" }]);
  });

  test("applies and resets SGR colors", () => {
    const parts = parseAnsiLine("\x1b[34mDocuments\x1b[0m  \x1b[32mscript.sh\x1b[0m");
    expect(parts).toEqual([
      { text: "Documents", color: "#3b82f6" },
      { text: "  " },
      { text: "script.sh", color: "#22c55e" },
    ]);
  });
});

describe("generate256Colors", () => {
  test("builds the 256-color palette in ANSI order", () => {
    const colors = generate256Colors();
    expect(colors).toHaveLength(256);
    expect(colors[0]).toBe("#000000");
    expect(colors[15]).toBe("#ffffff");
    expect(colors[16]).toBe("rgb(0, 0, 0)");
    expect(colors[231]).toBe("rgb(255, 255, 255)");
    expect(colors[232]).toBe("rgb(8, 8, 8)");
    expect(colors[255]).toBe("rgb(238, 238, 238)");
  });
});

describe("hslToRgb", () => {
  test("converts hue/saturation/lightness used by the truecolor picker", () => {
    expect(hslToRgb(0, 80, 50)).toEqual({ r: 230, g: 26, b: 26 });
    expect(hslToRgb(180, 80, 50)).toEqual({ r: 26, g: 230, b: 230 });
  });
});
