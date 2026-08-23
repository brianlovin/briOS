"use client";

import { useState } from "react";

import { TerminalWindow } from "../ui";
import { FeatureBox, InfoPanel, StepDotsNavigation, SubsectionLabel } from "../ui";

// Actual Nerd Font Unicode glyphs - these render as icons when the font is loaded
// Using the actual codepoints from Nerd Fonts v3
const NERD_GLYPHS = {
  // File icons (Seti-UI + Custom)
  folder: "\ue5ff", //
  folderOpen: "\ue5fe", //
  file: "\uf15b", //

  // Dev icons (Devicons)
  typescript: "\ue628", //
  javascript: "\ue781", //
  react: "\ue7ba", //
  python: "\ue73c", //
  rust: "\ue7a8", //

  // Git/GitHub (Octicons)
  git: "\uf1d3", //
  github: "\uf408", //

  // File types
  json: "\ue60b", //
  markdown: "\ue73e", //
  docker: "\uf308", //

  // System (Font Awesome)
  terminal: "\uf489", //
  gear: "\uf013", //
  lock: "\uf023", //

  // Status (Font Awesome)
  check: "\uf00c", //
  error: "\uf00d", //
  warning: "\uf071", //
  info: "\uf05a", //
};

// Component for rendering a Nerd Font icon
function NerdIcon({ glyph, className = "" }: { glyph: string; className?: string }) {
  return (
    <span
      className={`inline-block text-center leading-none ${className}`}
      style={{ fontFamily: "'JetBrainsMono Nerd Font', monospace" }}
    >
      {glyph}
    </span>
  );
}

// Icon data with actual glyphs and codepoints
const NERD_FONT_ICONS = [
  {
    icon: "folder",
    glyph: NERD_GLYPHS.folder,
    name: "Folder",
    codepoint: "U+E5FF",
    category: "Files",
    color: "text-secondary",
  },
  {
    icon: "folderOpen",
    glyph: NERD_GLYPHS.folderOpen,
    name: "Folder Open",
    codepoint: "U+E5FE",
    category: "Files",
    color: "text-secondary",
  },
  {
    icon: "file",
    glyph: NERD_GLYPHS.file,
    name: "File",
    codepoint: "U+F15B",
    category: "Files",
    color: "text-primary",
  },
  {
    icon: "typescript",
    glyph: NERD_GLYPHS.typescript,
    name: "TypeScript",
    codepoint: "U+E628",
    category: "Dev",
    color: "text-secondary",
  },
  {
    icon: "javascript",
    glyph: NERD_GLYPHS.javascript,
    name: "JavaScript",
    codepoint: "U+E781",
    category: "Dev",
    color: "text-secondary",
  },
  {
    icon: "react",
    glyph: NERD_GLYPHS.react,
    name: "React",
    codepoint: "U+E7BA",
    category: "Dev",
    color: "text-secondary",
  },
  {
    icon: "python",
    glyph: NERD_GLYPHS.python,
    name: "Python",
    codepoint: "U+E73C",
    category: "Dev",
    color: "text-secondary",
  },
  {
    icon: "rust",
    glyph: NERD_GLYPHS.rust,
    name: "Rust",
    codepoint: "U+E7A8",
    category: "Dev",
    color: "text-primary",
  },
  {
    icon: "git",
    glyph: NERD_GLYPHS.git,
    name: "Git",
    codepoint: "U+F1D3",
    category: "Dev",
    color: "text-primary",
  },
  {
    icon: "github",
    glyph: NERD_GLYPHS.github,
    name: "GitHub",
    codepoint: "U+F408",
    category: "Dev",
    color: "text-primary",
  },
  {
    icon: "docker",
    glyph: NERD_GLYPHS.docker,
    name: "Docker",
    codepoint: "U+F308",
    category: "Dev",
    color: "text-secondary",
  },
  {
    icon: "terminal",
    glyph: NERD_GLYPHS.terminal,
    name: "Terminal",
    codepoint: "U+F489",
    category: "System",
    color: "text-primary",
  },
  {
    icon: "gear",
    glyph: NERD_GLYPHS.gear,
    name: "Gear",
    codepoint: "U+F013",
    category: "System",
    color: "text-quaternary",
  },
  {
    icon: "lock",
    glyph: NERD_GLYPHS.lock,
    name: "Lock",
    codepoint: "U+F023",
    category: "System",
    color: "text-secondary",
  },
  {
    icon: "check",
    glyph: NERD_GLYPHS.check,
    name: "Check",
    codepoint: "U+F00C",
    category: "Status",
    color: "text-primary",
  },
  {
    icon: "error",
    glyph: NERD_GLYPHS.error,
    name: "Error",
    codepoint: "U+F00D",
    category: "Status",
    color: "text-primary",
  },
  {
    icon: "warning",
    glyph: NERD_GLYPHS.warning,
    name: "Warning",
    codepoint: "U+F071",
    category: "Status",
    color: "text-secondary",
  },
  {
    icon: "info",
    glyph: NERD_GLYPHS.info,
    name: "Info",
    codepoint: "U+F05A",
    category: "Status",
    color: "text-secondary",
  },
] as const;

type IconName = keyof typeof NERD_GLYPHS;

// File tree structure for the demo
const FILE_TREE: {
  name: string;
  type: "folder" | "file";
  icon: IconName;
  color: string;
  indent: number;
  codepoint: string;
}[] = [
  {
    name: "src",
    type: "folder",
    icon: "folder",
    color: "text-secondary",
    indent: 0,
    codepoint: "U+E5FF",
  },
  {
    name: "components",
    type: "folder",
    icon: "folder",
    color: "text-secondary",
    indent: 1,
    codepoint: "U+E5FF",
  },
  {
    name: "App.tsx",
    type: "file",
    icon: "react",
    color: "text-secondary",
    indent: 2,
    codepoint: "U+E7BA",
  },
  {
    name: "Button.tsx",
    type: "file",
    icon: "react",
    color: "text-secondary",
    indent: 2,
    codepoint: "U+E7BA",
  },
  {
    name: "utils",
    type: "folder",
    icon: "folder",
    color: "text-secondary",
    indent: 1,
    codepoint: "U+E5FF",
  },
  {
    name: "index.ts",
    type: "file",
    icon: "typescript",
    color: "text-secondary",
    indent: 1,
    codepoint: "U+E628",
  },
  {
    name: "package.json",
    type: "file",
    icon: "json",
    color: "text-primary",
    indent: 0,
    codepoint: "U+E60B",
  },
  {
    name: ".gitignore",
    type: "file",
    icon: "git",
    color: "text-primary",
    indent: 0,
    codepoint: "U+F1D3",
  },
  {
    name: "README.md",
    type: "file",
    icon: "markdown",
    color: "text-primary",
    indent: 0,
    codepoint: "U+E73E",
  },
  {
    name: "Dockerfile",
    type: "file",
    icon: "docker",
    color: "text-secondary",
    indent: 0,
    codepoint: "U+F308",
  },
];

type ExplainerStep = "what" | "how" | "pua" | "fonts" | "rendering";

const STEPS: Record<ExplainerStep, { title: string; description: string }> = {
  what: {
    title: "What Are Terminal Icons?",
    description:
      "Modern terminal apps like file explorers, status bars, and dev tools display icons for files, folders, and status indicators. These aren't images—they're Unicode characters rendered by special fonts.",
  },
  how: {
    title: "How They Work",
    description:
      "Terminal icons are just regular Unicode characters. The terminal treats them exactly like letters or numbers—one character per cell. The magic is in the font, which maps these codepoints to icon glyphs.",
  },
  pua: {
    title: "The Private Use Area",
    description:
      "Unicode reserves ranges (U+E000-U+F8FF) called Private Use Areas. Nerd Fonts place thousands of icons here—dev logos, file types, git symbols, and more. Apps output these codepoints; fonts render them as icons.",
  },
  fonts: {
    title: "Nerd Fonts",
    description:
      "Nerd Fonts are regular programming fonts (like JetBrains Mono or Fira Code) patched with 3,600+ icons. Install one, set it as your terminal font, and icons just work. No terminal configuration needed.",
  },
  rendering: {
    title: "The Rendering Pipeline",
    description:
      "When an app outputs an icon: 1) It prints a Unicode character (e.g., U+E628 for TypeScript). 2) The terminal looks up the character in its font. 3) The font maps U+E628 to a TypeScript logo glyph. 4) The terminal draws that glyph in a cell.",
  },
};

export function IconsDemo() {
  const [currentStep, setCurrentStep] = useState<ExplainerStep>("what");
  const [selectedIcon, setSelectedIcon] = useState<(typeof NERD_FONT_ICONS)[number]>(
    NERD_FONT_ICONS[0],
  );
  const [showWithIcons, setShowWithIcons] = useState(true);
  const [hoveredFile, setHoveredFile] = useState<number | null>(null);

  const steps = Object.keys(STEPS) as ExplainerStep[];
  const stepContent = STEPS[currentStep];

  const categories = [...new Set(NERD_FONT_ICONS.map((i) => i.category))];

  // Render icon using actual Nerd Font glyph
  const renderIcon = (iconName: IconName, color: string) => {
    const glyph = NERD_GLYPHS[iconName];
    if (!glyph) return null;
    return <NerdIcon glyph={glyph} className={`text-base ${color}`} />;
  };

  return (
    <div className="space-y-8">
      {/* Main Demo */}
      <div className="grid grid-cols-1 gap-6">
        {/* File Explorer Demo */}
        <div className="space-y-4">
          <TerminalWindow>
            <div className="min-h-[280px] font-mono text-sm">
              {/* Toggle */}
              <div className="border-primary mb-3 flex items-center gap-4 border-b pb-2">
                <button
                  onClick={() => setShowWithIcons(!showWithIcons)}
                  className={`px-2 py-1 text-xs transition-colors ${
                    showWithIcons
                      ? "bg-primary/10 text-primary"
                      : "text-quaternary hover:text-primary"
                  }`}
                >
                  {showWithIcons ? "Icons ON" : "Icons OFF"}
                </button>
                <span className="text-quaternary text-xs">
                  {showWithIcons ? "Showing actual Nerd Font glyphs" : "Plain text only"}
                </span>
              </div>

              {/* File tree */}
              <div className="space-y-0.5">
                {FILE_TREE.map((item, idx) => {
                  const isHovered = hoveredFile === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex cursor-pointer items-center gap-3 rounded px-2 py-0.5 transition-colors ${
                        isHovered ? "bg-primary/10" : "hover:bg-tertiary"
                      }`}
                      style={{ paddingLeft: `${item.indent * 16 + 8}px` }}
                      onMouseEnter={() => setHoveredFile(idx)}
                      onMouseLeave={() => setHoveredFile(null)}
                    >
                      {showWithIcons ? (
                        <span className="flex-shrink-0">{renderIcon(item.icon, item.color)}</span>
                      ) : (
                        <span className="text-quaternary w-4 text-center">
                          {item.type === "folder" ? "D" : "F"}
                        </span>
                      )}
                      <span className={isHovered ? "text-primary" : "text-primary"}>
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Hovered file info */}
              {hoveredFile !== null && (
                <div className="bg-secondary border-primary absolute right-4 bottom-4 z-10 border text-xs">
                  <div className="bg-tertiary flex items-center gap-4 rounded p-2">
                    <div className="bg-secondary border-primary flex h-8 w-8 items-center justify-center rounded border">
                      {renderIcon(FILE_TREE[hoveredFile].icon, FILE_TREE[hoveredFile].color)}
                    </div>
                    <div className="flex-1">
                      <div className="text-primary">
                        <span className="text-secondary">{FILE_TREE[hoveredFile].name}</span>
                      </div>
                      <div className="text-secondary font-mono">
                        {FILE_TREE[hoveredFile].codepoint}
                      </div>
                    </div>
                    <div className="text-quaternary text-right">
                      One character
                      <br />
                      One cell
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TerminalWindow>
        </div>

        {/* Explanation */}
        <div className="space-y-4">
          <InfoPanel className="space-y-4 px-4 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="text-primary text-sm font-medium">{stepContent.title}</div>
              <StepDotsNavigation
                steps={steps}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
              />
            </div>
            <div className="space-y-4">
              <p className="text-tertiary text-sm leading-relaxed">{stepContent.description}</p>

              {/* Step-specific content */}
              {currentStep === "pua" && (
                <div className="bg-tertiary space-y-2 p-3 font-mono text-xs">
                  <div className="text-quaternary">// Unicode Private Use Area ranges</div>
                  <div className="space-y-1">
                    <div>
                      <span className="text-secondary">U+E000 - U+F8FF</span>{" "}
                      <span className="text-quaternary">— Basic Multilingual Plane PUA</span>
                    </div>
                    <div>
                      <span className="text-secondary">U+F0000 - U+FFFFD</span>{" "}
                      <span className="text-quaternary">— Supplementary PUA-A</span>
                    </div>
                    <div>
                      <span className="text-secondary">U+100000 - U+10FFFD</span>{" "}
                      <span className="text-quaternary">— Supplementary PUA-B</span>
                    </div>
                  </div>
                  <div className="text-secondary mt-2">
                    Nerd Fonts uses ~3,600 codepoints in these ranges
                  </div>
                </div>
              )}

              {currentStep === "rendering" && (
                <div className="bg-tertiary space-y-3 p-3">
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex flex-col items-center">
                      <span className="text-secondary font-mono text-xs">App outputs</span>
                      <span className="text-secondary font-mono">U+E628</span>
                    </div>
                    <span className="text-quaternary">→</span>
                    <div className="flex flex-col items-center">
                      <span className="text-secondary font-mono text-xs">Font lookup</span>
                      <span className="text-primary">Nerd Font</span>
                    </div>
                    <span className="text-quaternary">→</span>
                    <div className="flex flex-col items-center">
                      <span className="text-secondary font-mono text-xs">Rendered</span>
                      <div className="h-6 w-6">{renderIcon("typescript", "text-secondary")}</div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "fonts" && (
                <div className="bg-tertiary space-y-2 p-3 text-xs">
                  <div className="text-quaternary">Popular Nerd Fonts:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-primary flex items-center gap-2">
                      {renderIcon("check", "text-primary")}
                      <span>JetBrainsMono Nerd Font</span>
                    </div>
                    <div className="text-primary flex items-center gap-2">
                      {renderIcon("check", "text-primary")}
                      <span>FiraCode Nerd Font</span>
                    </div>
                    <div className="text-primary flex items-center gap-2">
                      {renderIcon("check", "text-primary")}
                      <span>Hack Nerd Font</span>
                    </div>
                    <div className="text-primary flex items-center gap-2">
                      {renderIcon("check", "text-primary")}
                      <span>CaskaydiaCove Nerd Font</span>
                    </div>
                  </div>
                  <div className="text-secondary mt-2">Download: nerdfonts.com</div>
                </div>
              )}
            </div>
          </InfoPanel>
        </div>
      </div>

      {/* Icon Gallery */}
      <div className="bg-tertiary border-primary space-y-6 border p-6">
        <h3 className="text-primary text-sm font-bold">Nerd Font Icon Gallery</h3>
        <p className="text-quaternary text-sm">
          Click any icon to see its Unicode codepoint and how to use it in code.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Icon grid by category */}
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category} className="space-y-2">
                <SubsectionLabel className="mb-0">{category}</SubsectionLabel>
                <div className="flex flex-wrap gap-2">
                  {NERD_FONT_ICONS.filter((i) => i.category === category).map((item) => (
                    <button
                      key={item.codepoint}
                      onClick={() => setSelectedIcon(item)}
                      className={`flex h-10 w-10 items-center justify-center border transition-all ${
                        selectedIcon.codepoint === item.codepoint
                          ? "border-primary bg-primary/10 scale-110"
                          : "border-primary hover:border-primary"
                      }`}
                      title={item.name}
                    >
                      {renderIcon(item.icon as IconName, item.color)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Selected icon details */}
          <div className="bg-secondary border-primary space-y-3 border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-tertiary border-primary flex h-10 w-10 items-center justify-center border">
                {renderIcon(selectedIcon.icon as IconName, selectedIcon.color)}
              </div>
              <div className="text-primary font-bold">{selectedIcon.name}</div>
              <div className="text-secondary font-mono text-sm">{selectedIcon.codepoint}</div>
            </div>

            <div className="text-quaternary space-y-1 font-mono text-xs">
              <div>
                <span className="text-tertiary">Shell: </span>
                <span className="text-primary">
                  echo -e "\u
                  {selectedIcon.codepoint.replace("U+", "").toLowerCase()}"
                </span>
              </div>
              <div>
                <span className="text-tertiary">Code: </span>
                <span className="text-secondary">printf</span>
                <span className="text-secondary">(</span>
                <span className="text-primary">
                  "\\u{selectedIcon.codepoint.replace("U+", "").toLowerCase()}"
                </span>
                <span className="text-secondary">)</span>
              </div>
              <div>
                <span className="text-tertiary">Decimal: </span>
                <span className="text-secondary">
                  {parseInt(selectedIcon.codepoint.replace("U+", ""), 16)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Deep Dive */}
      <div className="bg-tertiary border-primary space-y-4 border p-6">
        <h3 className="text-primary text-sm font-bold">Under the Hood: Why One Cell?</h3>

        <div className="grid grid-cols-1 gap-4">
          <FeatureBox number={1} title="Single Codepoint">
            <p className="text-quaternary text-sm">
              Each Nerd Font icon is a single Unicode codepoint. The terminal sees it as one
              character, just like 'A' or '中'. One character = one cell.
            </p>
          </FeatureBox>

          <FeatureBox number={2} title="Font Glyphs">
            <p className="text-quaternary text-sm">
              The font file contains a glyph (vector drawing) for each codepoint. Nerd Fonts add
              thousands of icon glyphs sized to fit the terminal's cell dimensions.
            </p>
          </FeatureBox>

          <FeatureBox number={3} title="Cell-Sized Design">
            <p className="text-quaternary text-sm">
              Icon glyphs are designed to fit within a monospace cell. They're square or slightly
              rectangular to match the terminal's character grid perfectly.
            </p>
          </FeatureBox>
        </div>

        {/* Character width comparison */}
        <div className="bg-tertiary border-primary space-y-3 border p-4">
          <div className="text-primary text-sm font-bold">Character Width in Terminals</div>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex items-center gap-4">
              <div className="text-quaternary w-24">Single-width:</div>
              <div className="flex">
                {["A", "B", "C"].map((char, i) => (
                  <div
                    key={i}
                    className="border-primary bg-tertiary flex h-6 w-5 items-center justify-center border"
                  >
                    {char}
                  </div>
                ))}
                {[NERD_GLYPHS.folder, NERD_GLYPHS.file, NERD_GLYPHS.check].map((glyph, i) => (
                  <div
                    key={`icon-${i}`}
                    className="border-primary bg-tertiary flex h-6 w-5 items-center justify-center border"
                  >
                    <NerdIcon glyph={glyph} className="text-primary text-sm" />
                  </div>
                ))}
              </div>
              <span className="text-quaternary text-xs">1 cell each</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-quaternary w-24">Double-width:</div>
              <div className="flex">
                {["中", "文", "字"].map((char, i) => (
                  <div
                    key={i}
                    className="border-primary bg-tertiary flex h-6 w-10 items-center justify-center border"
                  >
                    {char}
                  </div>
                ))}
              </div>
              <span className="text-quaternary text-xs">2 cells each (CJK)</span>
            </div>
          </div>
          <p className="text-quaternary text-xs">
            Nerd Font icons are single-width characters. CJK characters and some emoji are
            double-width.
          </p>
        </div>
      </div>

      {/* Common Icon Sets Reference */}
      <IconSetsReference />
    </div>
  );
}

// Powerline glyphs
const POWERLINE_GLYPHS = {
  arrowRight: "\ue0b0",
  arrowLeft: "\ue0b2",
  roundedRight: "\ue0b4",
};

function IconSetsReference() {
  const iconSets = [
    {
      name: "Powerline",
      description: "Status bar separators and arrows",
      range: "U+E0A0-E0D4",
      glyphs: [
        POWERLINE_GLYPHS.arrowRight,
        POWERLINE_GLYPHS.arrowLeft,
        POWERLINE_GLYPHS.roundedRight,
      ],
      fontSize: 12,
    },
    {
      name: "Font Awesome",
      description: "General purpose icons",
      range: "U+F000-F2E0",
      glyphs: [NERD_GLYPHS.folder, NERD_GLYPHS.file, NERD_GLYPHS.gear, NERD_GLYPHS.lock],
      fontSize: 14,
    },
    {
      name: "Devicons",
      description: "Programming language logos",
      range: "U+E700-E7C5",
      glyphs: [
        NERD_GLYPHS.typescript,
        NERD_GLYPHS.javascript,
        NERD_GLYPHS.react,
        NERD_GLYPHS.python,
        NERD_GLYPHS.rust,
      ],
      fontSize: 16,
    },
    {
      name: "Octicons",
      description: "GitHub-style icons",
      range: "U+F400-F532",
      glyphs: [NERD_GLYPHS.github, NERD_GLYPHS.git, NERD_GLYPHS.terminal],
      fontSize: 14,
    },
  ];

  return (
    <div className="bg-tertiary border-primary space-y-4 border p-6">
      <h3 className="text-primary text-sm font-bold">Icon Sets in Nerd Fonts</h3>
      <p className="text-quaternary text-sm">
        Nerd Fonts combines multiple icon sets into one font. Each set occupies a different Unicode
        range.
      </p>

      <div className="divide-primary divide-y">
        {iconSets.map((set) => (
          <div key={set.name} className="flex flex-col gap-3 py-3 md:flex-row md:items-center">
            <div className="md:w-32">
              <div className="text-primary text-sm font-bold">{set.name}</div>
              <div className="text-secondary font-mono text-xs">{set.range}</div>
            </div>
            <div className="text-quaternary flex-1 text-xs">{set.description}</div>
            <div className="flex gap-2">
              {set.glyphs.map((glyph, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center overflow-hidden"
                  style={{ width: 20, height: 20 }}
                >
                  <span
                    className="text-primary"
                    style={{
                      fontFamily: "'JetBrainsMono Nerd Font', monospace",
                      fontSize: set.fontSize,
                      lineHeight: 1,
                    }}
                  >
                    {glyph}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
