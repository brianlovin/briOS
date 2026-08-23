import { describe, expect, test } from "bun:test";

import { encodeMouseClick, FEATURE_SEQUENCES, SPECIAL_KEYS, TERM_CAPABILITIES } from "./sequences";

describe("SPECIAL_KEYS", () => {
  test("maps arrow keys and control keys to their byte sequences", () => {
    expect(SPECIAL_KEYS.ArrowUp).toEqual({
      bytes: "1b 5b 41",
      sequence: "^[[A",
      desc: "Cursor Up",
    });
    expect(SPECIAL_KEYS.Enter).toEqual({
      bytes: "0d",
      sequence: "^M",
      desc: "Carriage Return",
    });
    expect(SPECIAL_KEYS.Escape).toEqual({ bytes: "1b", sequence: "^[", desc: "Escape" });
  });
});

describe("encodeMouseClick", () => {
  test("encodes X10 mouse reporting from 0-based grid cells", () => {
    expect(encodeMouseClick(0, 0, 0)).toEqual({
      x: 1,
      y: 1,
      button: 0,
      sequence: `^[[M${String.fromCharCode(32)}${String.fromCharCode(33)}${String.fromCharCode(33)}`,
      bytes: "1b 5b 4d 20 21 21",
    });
  });
});

describe("TERM_CAPABILITIES", () => {
  test("describes modern and legacy terminals", () => {
    expect(TERM_CAPABILITIES["xterm-256color"]?.colors).toBe(256);
    expect(TERM_CAPABILITIES["xterm-256color"]?.mouse).toBe(true);
    expect(TERM_CAPABILITIES.vt100?.colors).toBe(0);
    expect(TERM_CAPABILITIES.vt100?.mouse).toBe(false);
    expect(TERM_CAPABILITIES.dumb?.description).toBe("No special capabilities");
  });
});

describe("FEATURE_SEQUENCES", () => {
  test("uses the enable/disable sequences programs send", () => {
    const alt = FEATURE_SEQUENCES.find((feature) => feature.id === "altscreen");
    expect(alt?.enable).toBe("^[[?1049h");
    expect(alt?.disable).toBe("^[[?1049l");
    expect(FEATURE_SEQUENCES.find((feature) => feature.id === "mouse")?.enable).toBe("^[[?1000h");
  });
});
