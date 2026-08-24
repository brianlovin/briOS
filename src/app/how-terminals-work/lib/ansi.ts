/** Standard 16-color ANSI palette used by the cell and escape demos. */
export const ANSI_16 = {
  black: "#0a0a0a",
  red: "#f85149",
  green: "#22c55e",
  yellow: "#eab308",
  blue: "#3b82f6",
  magenta: "#a855f7",
  cyan: "#06b6d4",
  white: "#e5e5e5",
  brightBlack: "#525252",
  brightRed: "#ff7b72",
  brightGreen: "#4ade80",
  brightYellow: "#facc15",
  brightBlue: "#60a5fa",
  brightMagenta: "#c084fc",
  brightCyan: "#22d3ee",
  brightWhite: "#fafafa",
} as const;

export const ANSI_SGR_COLORS: Record<string, string> = {
  "30": ANSI_16.black,
  "31": ANSI_16.red,
  "32": ANSI_16.green,
  "33": ANSI_16.yellow,
  "34": ANSI_16.blue,
  "35": ANSI_16.magenta,
  "36": ANSI_16.cyan,
  "37": ANSI_16.white,
  "90": ANSI_16.brightBlack,
  "91": ANSI_16.brightRed,
  "92": ANSI_16.brightGreen,
  "93": ANSI_16.brightYellow,
  "94": ANSI_16.brightBlue,
  "95": ANSI_16.brightMagenta,
  "96": ANSI_16.brightCyan,
  "97": ANSI_16.brightWhite,
};

export type AnsiSpan = { text: string; color?: string };

export function parseAnsiLine(line: string): AnsiSpan[] {
  const parts: AnsiSpan[] = [];
  let current = "";
  let currentColor: string | undefined;
  let i = 0;

  while (i < line.length) {
    if (line[i] === "\x1b" && line[i + 1] === "[") {
      if (current) {
        parts.push({ text: current, color: currentColor });
        current = "";
      }
      let j = i + 2;
      while (j < line.length && line[j] !== "m") j++;
      const code = line.slice(i + 2, j);
      if (code === "0") currentColor = undefined;
      else if (ANSI_SGR_COLORS[code]) currentColor = ANSI_SGR_COLORS[code];
      i = j + 1;
    } else {
      current += line[i];
      i++;
    }
  }
  if (current) parts.push({ text: current, color: currentColor });
  return parts;
}

export function generate256Colors(): string[] {
  const colors: string[] = [];
  const standard16 = [
    "#000000",
    "#cd0000",
    "#00cd00",
    "#cdcd00",
    "#0000ee",
    "#cd00cd",
    "#00cdcd",
    "#e5e5e5",
    "#7f7f7f",
    "#ff0000",
    "#00ff00",
    "#ffff00",
    "#5c5cff",
    "#ff00ff",
    "#00ffff",
    "#ffffff",
  ];
  colors.push(...standard16);

  const levels = [0, 95, 135, 175, 215, 255];
  for (let r = 0; r < 6; r++) {
    for (let g = 0; g < 6; g++) {
      for (let b = 0; b < 6; b++) {
        colors.push(`rgb(${levels[r]}, ${levels[g]}, ${levels[b]})`);
      }
    }
  }

  for (let i = 0; i < 24; i++) {
    const gray = 8 + i * 10;
    colors.push(`rgb(${gray}, ${gray}, ${gray})`);
  }

  return colors;
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round((l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)) * 255);
  };
  return { r: f(0), g: f(8), b: f(4) };
}
