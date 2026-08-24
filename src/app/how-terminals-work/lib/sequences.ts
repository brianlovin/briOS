export const SPECIAL_KEYS: Record<string, { bytes: string; sequence: string; desc: string }> = {
  ArrowUp: { bytes: "1b 5b 41", sequence: "^[[A", desc: "Cursor Up" },
  ArrowDown: { bytes: "1b 5b 42", sequence: "^[[B", desc: "Cursor Down" },
  ArrowRight: { bytes: "1b 5b 43", sequence: "^[[C", desc: "Cursor Right" },
  ArrowLeft: { bytes: "1b 5b 44", sequence: "^[[D", desc: "Cursor Left" },
  Enter: { bytes: "0d", sequence: "^M", desc: "Carriage Return" },
  Tab: { bytes: "09", sequence: "^I", desc: "Horizontal Tab" },
  Backspace: { bytes: "7f", sequence: "^?", desc: "Delete" },
  Escape: { bytes: "1b", sequence: "^[", desc: "Escape" },
};

export function encodeMouseClick(
  row: number,
  col: number,
  button: number,
): { x: number; y: number; button: number; sequence: string; bytes: string } {
  const x = col + 1 + 32;
  const y = row + 1 + 32;
  const encodedButton = button + 32;
  return {
    x: col + 1,
    y: row + 1,
    button,
    sequence: `^[[M${String.fromCharCode(encodedButton)}${String.fromCharCode(x)}${String.fromCharCode(y)}`,
    bytes: `1b 5b 4d ${encodedButton.toString(16)} ${x.toString(16)} ${y.toString(16)}`,
  };
}

export const TERM_CAPABILITIES: Record<
  string,
  {
    colors: number;
    mouse: boolean;
    altScreen: boolean;
    unicode: boolean;
    description: string;
  }
> = {
  "xterm-256color": {
    colors: 256,
    mouse: true,
    altScreen: true,
    unicode: true,
    description: "Modern terminal with 256-color support",
  },
  xterm: {
    colors: 16,
    mouse: true,
    altScreen: true,
    unicode: true,
    description: "Standard X terminal emulator",
  },
  "screen-256color": {
    colors: 256,
    mouse: true,
    altScreen: true,
    unicode: true,
    description: "GNU Screen with 256 colors",
  },
  vt100: {
    colors: 0,
    mouse: false,
    altScreen: false,
    unicode: false,
    description: "DEC terminal from 1978",
  },
  dumb: {
    colors: 0,
    mouse: false,
    altScreen: false,
    unicode: false,
    description: "No special capabilities",
  },
};

export const FEATURE_SEQUENCES = [
  {
    id: "mouse",
    name: "Mouse Tracking",
    enable: "^[[?1000h",
    disable: "^[[?1000l",
    description: "Report mouse clicks as escape sequences",
  },
  {
    id: "altscreen",
    name: "Alternate Screen",
    enable: "^[[?1049h",
    disable: "^[[?1049l",
    description: "Switch to a separate screen buffer",
  },
  {
    id: "bracketed",
    name: "Bracketed Paste",
    enable: "^[[?2004h",
    disable: "^[[?2004l",
    description: "Wrap pasted text with special markers",
  },
] as const;

export const DA1_CODES: Record<string, string> = {
  "1": "132 columns",
  "2": "Printer port",
  "4": "Sixel graphics",
  "6": "Selective erase",
  "7": "Soft fonts (DRCS)",
  "8": "User-defined keys",
  "9": "National replacement sets",
  "15": "Technical character set",
  "18": "Windowing capability",
  "21": "Horizontal scrolling",
  "22": "ANSI color",
  "28": "Rectangular editing",
  "29": "ANSI text locator",
};
