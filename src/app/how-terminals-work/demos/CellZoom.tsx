"use client";

import { useMemo, useState } from "react";

import { TerminalWindow } from "../ui";
import { InfoPanel, SubsectionLabel } from "../ui";

type ColorMode = "16" | "256" | "truecolor";

// Standard 16-color ANSI palette (matching index.css theme)
const COLORS = {
  // Normal colors (0-7)
  black: "#0a0a0a",
  red: "#f85149",
  green: "#22c55e",
  yellow: "#eab308",
  blue: "#3b82f6",
  magenta: "#a855f7",
  cyan: "#06b6d4",
  white: "#e5e5e5",
  // Bright colors (8-15)
  brightBlack: "#525252",
  brightRed: "#ff7b72",
  brightGreen: "#4ade80",
  brightYellow: "#facc15",
  brightBlue: "#60a5fa",
  brightMagenta: "#c084fc",
  brightCyan: "#22d3ee",
  brightWhite: "#fafafa",
};
const BG_COLORS = {
  none: "transparent",
  dim: "#171717",
  green: "#22c55e33",
  red: "#f8514933",
  blue: "#3b82f633",
  yellow: "#eab30833",
  magenta: "#a855f733",
  cyan: "#06b6d433",
};

export function CellZoom() {
  const [char, setChar] = useState("A");
  const [fg, setFg] = useState<keyof typeof COLORS>("green");
  const [bg, setBg] = useState<keyof typeof BG_COLORS>("none");
  const [bold, setBold] = useState(false);
  const [underline, setUnderline] = useState(false);

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%".split("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <TerminalWindow className="flex-shrink-0">
          <div className="flex items-center justify-center p-6">
            <div
              className={`border-primary flex h-40 w-28 items-center justify-center border text-7xl transition-all duration-200 ${bold ? "font-bold" : ""} ${underline ? "underline" : ""}`}
              style={{ color: COLORS[fg], backgroundColor: BG_COLORS[bg] }}
            >
              {char}
            </div>
          </div>
        </TerminalWindow>

        <div className="flex-1 space-y-5">
          <div>
            <SubsectionLabel>Character</SubsectionLabel>
            <div className="flex flex-wrap gap-1">
              {chars.slice(0, 20).map((c) => (
                <button
                  key={c}
                  onClick={() => setChar(c)}
                  className={`flex h-7 w-7 items-center justify-center border text-sm transition-colors ${char === c ? "border-primary bg-primary/10 text-primary" : "border-primary text-tertiary hover:border-primary hover:text-primary"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <SubsectionLabel>Foreground</SubsectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(COLORS) as Array<keyof typeof COLORS>).map((color) => (
                <button
                  key={color}
                  onClick={() => setFg(color)}
                  className={`h-6 w-6 focus:outline-none ${fg === color ? "ring-primary ring-offset-primary ring-2 ring-offset-2" : ""}`}
                  style={{ backgroundColor: COLORS[color] }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div>
            <SubsectionLabel>Background</SubsectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(BG_COLORS) as Array<keyof typeof BG_COLORS>).map((color) => (
                <button
                  key={color}
                  onClick={() => setBg(color)}
                  className={`border-primary h-6 w-6 border focus:outline-none ${bg === color ? "ring-primary ring-offset-primary ring-2 ring-offset-2" : ""}`}
                  style={{
                    backgroundColor: color === "none" ? "#0a0a0a" : BG_COLORS[color],
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div>
            <SubsectionLabel>Attributes</SubsectionLabel>
            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={bold}
                  onChange={(e) => setBold(e.target.checked)}
                  className="accent-primary h-4 w-4 border-0 outline-none"
                />
                <span className={`text-tertiary ${bold ? "text-primary font-bold" : ""}`}>
                  Bold
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={underline}
                  onChange={(e) => setUnderline(e.target.checked)}
                  className="accent-primary h-4 w-4 border-0 outline-none"
                />
                <span className={`text-tertiary ${underline ? "text-primary underline" : ""}`}>
                  Underline
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <InfoPanel>
        <span className="text-quaternary">Cell: </span>
        <span className="text-primary font-medium">"{char}"</span>
        <span className="text-quaternary"> / </span>
        <span style={{ color: COLORS[fg] }}>{fg}</span>
        {bg !== "none" && (
          <>
            <span className="text-quaternary"> on </span>
            <span className="text-tertiary">{bg}</span>
          </>
        )}
        {bold && (
          <>
            <span className="text-quaternary"> / </span>
            <span className="text-primary font-bold">bold</span>
          </>
        )}
        {underline && (
          <>
            <span className="text-quaternary"> / </span>
            <span className="text-primary underline">underlined</span>
          </>
        )}
      </InfoPanel>

      {/* Color Depth Exploration */}
      <ColorDepthExplorer />
    </div>
  );
}

// Generate 256-color palette
function generate256Colors(): string[] {
  const colors: string[] = [];

  // Standard 16 colors (0-15)
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

  // 216 colors (6x6x6 cube, indices 16-231)
  const levels = [0, 95, 135, 175, 215, 255];
  for (let r = 0; r < 6; r++) {
    for (let g = 0; g < 6; g++) {
      for (let b = 0; b < 6; b++) {
        colors.push(`rgb(${levels[r]}, ${levels[g]}, ${levels[b]})`);
      }
    }
  }

  // 24 grayscale colors (indices 232-255)
  for (let i = 0; i < 24; i++) {
    const gray = 8 + i * 10;
    colors.push(`rgb(${gray}, ${gray}, ${gray})`);
  }

  return colors;
}

function ColorDepthExplorer() {
  const [colorMode, setColorMode] = useState<ColorMode>("16");
  const [truecolorHue, setTruecolorHue] = useState(180);
  const [truecolorSat, setTruecolorSat] = useState(80);
  const [truecolorLight, setTruecolorLight] = useState(50);
  const [selected256, setSelected256] = useState(196); // Default to bright red

  const colors256 = useMemo(() => generate256Colors(), []);

  const truecolorValue = `hsl(${truecolorHue}, ${truecolorSat}%, ${truecolorLight}%)`;

  // Convert HSL to RGB for escape sequence display
  // Standard HSL to RGB algorithm: https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      return Math.round((l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)) * 255);
    };
    return { r: f(0), g: f(8), b: f(4) };
  };

  const rgb = hslToRgb(truecolorHue, truecolorSat, truecolorLight);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-primary mb-2 text-sm font-bold">Color Depth in Terminals</h3>
        <p className="text-tertiary text-sm">
          Modern terminals support more than just 16 colors. Explore the different color modes
          available.
        </p>
      </div>

      {/* Mode selector */}
      <div className="flex flex-wrap gap-2">
        {[
          { mode: "16" as ColorMode, label: "16 Colors", desc: "Classic ANSI" },
          { mode: "256" as ColorMode, label: "256 Colors", desc: "Extended palette" },
          { mode: "truecolor" as ColorMode, label: "Truecolor", desc: "16 million colors" },
        ].map(({ mode, label, desc }) => (
          <button
            key={mode}
            onClick={() => setColorMode(mode)}
            className={`border px-4 py-2 text-sm transition-all ${
              colorMode === mode
                ? "border-primary bg-primary/10 text-primary"
                : "border-primary text-tertiary hover:text-primary"
            }`}
          >
            <div className="font-bold">{label}</div>
            <div className="text-xs opacity-70">{desc}</div>
          </button>
        ))}
      </div>

      {/* Color mode content */}
      {colorMode === "16" && (
        <div className="space-y-4">
          <SubsectionLabel>The Original 16 Colors</SubsectionLabel>
          <div className="grid grid-cols-8 gap-1">
            {Object.entries(COLORS).map(([name, color]) => (
              <div key={name} className="text-center">
                <div
                  className="border-primary/50 h-8 border"
                  style={{ backgroundColor: color }}
                  title={name}
                />
                <div className="text-quaternary mt-1 truncate text-[9px]">
                  {name.replace("bright", "br")}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-1 font-mono text-xs">
            <div className="text-quaternary">Escape sequence format:</div>
            <div>
              <span className="text-secondary">^[[38;5;</span>
              <span className="text-secondary">{"<0-15>"}</span>
              <span className="text-secondary">m</span>
              <span className="text-tertiary"> — foreground</span>
            </div>
            <div>
              <span className="text-secondary">^[[48;5;</span>
              <span className="text-secondary">{"<0-15>"}</span>
              <span className="text-secondary">m</span>
              <span className="text-tertiary"> — background</span>
            </div>
          </div>
        </div>
      )}

      {colorMode === "256" && (
        <div className="space-y-4">
          <SubsectionLabel>256-Color Extended Palette</SubsectionLabel>

          {/* Standard 16 */}
          <div>
            <div className="text-quaternary mb-1 text-xs">Standard 16 (0-15)</div>
            <div className="flex gap-px">
              {colors256.slice(0, 16).map((color, i) => (
                <button
                  key={i}
                  className={`h-6 flex-1 ${selected256 === i ? "ring-primary ring-2" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelected256(i)}
                  title={`Color ${i}`}
                />
              ))}
            </div>
          </div>

          {/* 216 color cube */}
          <div>
            <div className="text-quaternary mb-1 text-xs">6×6×6 Color Cube (16-231)</div>
            <div className="grid grid-cols-36 gap-px">
              {colors256.slice(16, 232).map((color, i) => (
                <button
                  key={i + 16}
                  className={`h-3 ${selected256 === i + 16 ? "ring-primary ring-1" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelected256(i + 16)}
                  title={`Color ${i + 16}`}
                />
              ))}
            </div>
          </div>

          {/* Grayscale */}
          <div>
            <div className="text-quaternary mb-1 text-xs">Grayscale (232-255)</div>
            <div className="flex gap-px">
              {colors256.slice(232).map((color, i) => (
                <button
                  key={i + 232}
                  className={`h-6 flex-1 ${selected256 === i + 232 ? "ring-primary ring-2" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelected256(i + 232)}
                  title={`Color ${i + 232}`}
                />
              ))}
            </div>
          </div>

          {/* Selected color info */}
          <div className="flex items-center gap-4">
            <div
              className="border-primary h-12 w-12 border"
              style={{ backgroundColor: colors256[selected256] }}
            />
            <div className="font-mono text-sm">
              <div className="text-primary">Color {selected256}</div>
              <div className="text-secondary text-xs">^[[38;5;{selected256}m</div>
            </div>
          </div>
        </div>
      )}

      {colorMode === "truecolor" && (
        <div className="space-y-4">
          <SubsectionLabel>24-bit Truecolor (16 Million Colors)</SubsectionLabel>

          {/* Color picker */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-quaternary mb-1 block text-xs">Hue: {truecolorHue}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={truecolorHue}
                  onChange={(e) => setTruecolorHue(Number(e.target.value))}
                  className="h-3 w-full cursor-pointer appearance-none"
                  style={{
                    background:
                      "linear-gradient(to right, hsl(0,80%,50%), hsl(60,80%,50%), hsl(120,80%,50%), hsl(180,80%,50%), hsl(240,80%,50%), hsl(300,80%,50%), hsl(360,80%,50%))",
                  }}
                />
              </div>
              <div>
                <label className="text-quaternary mb-1 block text-xs">
                  Saturation: {truecolorSat}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={truecolorSat}
                  onChange={(e) => setTruecolorSat(Number(e.target.value))}
                  className="bg-tertiary h-3 w-full cursor-pointer appearance-none"
                />
              </div>
              <div>
                <label className="text-quaternary mb-1 block text-xs">
                  Lightness: {truecolorLight}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={truecolorLight}
                  onChange={(e) => setTruecolorLight(Number(e.target.value))}
                  className="bg-tertiary h-3 w-full cursor-pointer appearance-none"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div
                className="border-primary h-24 w-24 border"
                style={{ backgroundColor: truecolorValue }}
              />
              <div className="mt-2 text-center font-mono text-sm">
                <div className="text-primary">
                  RGB({rgb.r}, {rgb.g}, {rgb.b})
                </div>
                <div className="text-secondary text-xs">
                  ^[[38;2;{rgb.r};{rgb.g};{rgb.b}m
                </div>
              </div>
            </div>
          </div>

          {/* Gradient demonstration */}
          <div>
            <div className="text-quaternary mb-1 text-xs">
              Smooth gradient (only possible with truecolor)
            </div>
            <div
              className="h-8"
              style={{
                background: `linear-gradient(to right,
                  hsl(0, 80%, 50%),
                  hsl(60, 80%, 50%),
                  hsl(120, 80%, 50%),
                  hsl(180, 80%, 50%),
                  hsl(240, 80%, 50%),
                  hsl(300, 80%, 50%),
                  hsl(360, 80%, 50%)
                )`,
              }}
            />
          </div>
        </div>
      )}

      {/* Comparison */}
      <div className="border-primary border-t pt-4">
        <div className="text-quaternary mb-2 text-xs">Color count comparison:</div>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-primary font-bold">16</div>
            <div className="text-tertiary text-xs">Classic ANSI</div>
          </div>
          <div>
            <div className="text-secondary font-bold">256</div>
            <div className="text-tertiary text-xs">Extended</div>
          </div>
          <div>
            <div className="text-secondary font-bold">16,777,216</div>
            <div className="text-tertiary text-xs">Truecolor (24-bit)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
