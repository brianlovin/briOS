"use client";

import { useCallback, useRef, useState } from "react";

import { FeatureBox, StepDotsNavigation, TerminalWindow } from "../ui";

interface Region {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  focusable: boolean;
}

// Simulated TUI data
const SIDEBAR_ITEMS = [
  { id: "deploy-1", name: "ci-fe-be-rules", status: "success" },
  { id: "deploy-2", name: "ci-api-test", status: "running" },
  { id: "deploy-3", name: "ci-email-service", status: "success" },
  { id: "deploy-4", name: "ci-auth-core", status: "failed" },
  { id: "deploy-5", name: "ci-db-migration", status: "pending" },
];

const TABS = ["Continuous", "Integration", "Logging"];

type ExplainerStep =
  | "overview"
  | "layout-system"
  | "focus-management"
  | "resize-handling"
  | "rendering";

interface StepContent {
  title: string;
  description: string;
  highlightRegions: string[];
}

const EXPLAINER_STEPS: Record<ExplainerStep, StepContent> = {
  overview: {
    title: "The Layout System",
    description:
      "Advanced TUIs divide the terminal into regions. Each region is a rectangular area with its own content and borders. The TUI framework tracks each region's position and size in the character grid.",
    highlightRegions: ["tabs", "sidebar", "content"],
  },
  "layout-system": {
    title: "Region Coordinates",
    description:
      "Each region stores its position (x, y) and dimensions (width, height) in character cells. Box-drawing characters (like ┌─┐│) create visual borders. The TUI recalculates these when content changes.",
    highlightRegions: [],
  },
  "focus-management": {
    title: "Focus & Input Routing",
    description:
      "Only one region is 'focused' at a time (shown with a green border). Keystrokes are routed to the focused region. Tab/arrow keys move focus between regions. The cursor position is tracked within the focused region.",
    highlightRegions: ["sidebar"],
  },
  "resize-handling": {
    title: "Terminal Resize",
    description:
      "When you resize the terminal window, it sends a SIGWINCH signal. The TUI queries the new size with ioctl(), then recalculates every region's dimensions and re-renders the entire screen.",
    highlightRegions: [],
  },
  rendering: {
    title: "Full-Screen Rendering",
    description:
      "TUIs often use 'alternate screen mode' (CSI ?1049h) for a clean canvas. They position the cursor with escape codes and draw each cell. Double-buffering prevents flicker: draw to memory first, then output all at once.",
    highlightRegions: [],
  },
};

export function AdvancedTUIDemo() {
  const [currentStep, setCurrentStep] = useState<ExplainerStep>("overview");
  const [activeTab, setActiveTab] = useState(0);
  const [selectedItem, setSelectedItem] = useState(0);
  const [focusedRegion, setFocusedRegion] = useState<"tabs" | "sidebar" | "content">("sidebar");
  const [terminalSize, setTerminalSize] = useState({ cols: 60, rows: 20 });
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation in the demo
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const regions: ("tabs" | "sidebar" | "content")[] = ["tabs", "sidebar", "content"];
        const currentIdx = regions.indexOf(focusedRegion);
        setFocusedRegion(regions[(currentIdx + 1) % regions.length]!);
      } else if (focusedRegion === "tabs" && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault();
        setActiveTab((prev) => {
          if (e.key === "ArrowLeft") return Math.max(0, prev - 1);
          return Math.min(TABS.length - 1, prev + 1);
        });
      } else if (focusedRegion === "sidebar" && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        setSelectedItem((prev) => {
          if (e.key === "ArrowUp") return Math.max(0, prev - 1);
          return Math.min(SIDEBAR_ITEMS.length - 1, prev + 1);
        });
      }
    },
    [focusedRegion],
  );

  // Simulate resize
  const simulateResize = () => {
    setIsResizing(true);
    const sizes = [
      { cols: 60, rows: 20 },
      { cols: 80, rows: 24 },
      { cols: 50, rows: 16 },
      { cols: 60, rows: 20 },
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < sizes.length) {
        setTerminalSize(sizes[i]!);
        i++;
      } else {
        clearInterval(interval);
        setIsResizing(false);
      }
    }, 600);
  };

  // Calculate region dimensions based on terminal size
  const calculateRegions = (): Region[] => {
    const sidebarWidth = Math.floor(terminalSize.cols * 0.35);
    const contentWidth = terminalSize.cols - sidebarWidth;
    const tabHeight = 3;
    const contentHeight = terminalSize.rows - tabHeight;

    return [
      {
        id: "tabs",
        name: "Tab Bar",
        x: 0,
        y: 0,
        width: terminalSize.cols,
        height: tabHeight,
        color: "text-secondary",
        focusable: true,
      },
      {
        id: "sidebar",
        name: "Sidebar",
        x: 0,
        y: tabHeight,
        width: sidebarWidth,
        height: contentHeight,
        color: "text-secondary",
        focusable: true,
      },
      {
        id: "content",
        name: "Content",
        x: sidebarWidth,
        y: tabHeight,
        width: contentWidth,
        height: contentHeight,
        color: "text-secondary",
        focusable: true,
      },
    ];
  };

  const regions = calculateRegions();
  const stepContent = EXPLAINER_STEPS[currentStep];

  // Render the simulated TUI
  const renderTUI = () => {
    const selectedDeploy = SIDEBAR_ITEMS[selectedItem]!;
    const sidebarWidth = Math.floor(terminalSize.cols * 0.35);

    // Generate status content
    const statusColor = {
      success: "text-primary",
      running: "text-secondary",
      failed: "text-primary",
      pending: "text-quaternary",
    }[selectedDeploy.status];

    return (
      <div
        className="font-mono text-xs leading-tight select-none"
        style={{ minWidth: `${terminalSize.cols}ch` }}
      >
        {/* Tab bar */}
        <div
          className={`border-primary flex border-b ${focusedRegion === "tabs" ? "ring-primary ring-1" : ""}`}
          onClick={() => setFocusedRegion("tabs")}
        >
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab(i);
                setFocusedRegion("tabs");
              }}
              className={`border-primary border-r px-3 py-1 transition-colors ${
                i === activeTab
                  ? "bg-primary/10 text-primary border-b-primary border-b-2"
                  : "text-quaternary hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
          {showCoordinates && (
            <span className="text-secondary ml-auto self-center pr-2 text-[10px]">
              Region: tabs (0,0) {terminalSize.cols}x3
            </span>
          )}
        </div>

        {/* Main content area */}
        <div className="flex" style={{ height: `${(terminalSize.rows - 3) * 1.25}em` }}>
          {/* Sidebar */}
          <div
            className={`border-primary overflow-hidden border-r ${focusedRegion === "sidebar" ? "ring-primary ring-1" : ""}`}
            style={{ width: `${sidebarWidth}ch` }}
            onClick={() => setFocusedRegion("sidebar")}
          >
            {showCoordinates && (
              <div className="text-secondary border-primary border-b px-2 py-1 text-[10px]">
                Region: sidebar (0,3) {sidebarWidth}x{terminalSize.rows - 3}
              </div>
            )}
            <div className="p-1">
              {SIDEBAR_ITEMS.map((item, i) => {
                const statusIcon = {
                  success: "✓",
                  running: "◐",
                  failed: "✗",
                  pending: "○",
                }[item.status];
                const itemStatusColor = {
                  success: "text-primary",
                  running: "text-secondary",
                  failed: "text-primary",
                  pending: "text-quaternary",
                }[item.status];

                return (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(i);
                      setFocusedRegion("sidebar");
                    }}
                    className={`flex cursor-pointer items-center gap-1 truncate px-2 py-0.5 ${
                      i === selectedItem ? "bg-primary/10 text-primary" : "hover:bg-tertiary"
                    }`}
                  >
                    <span className={itemStatusColor}>{statusIcon}</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content area */}
          <div
            className={`flex-1 overflow-hidden p-2 ${focusedRegion === "content" ? "ring-primary ring-1" : ""}`}
            onClick={() => setFocusedRegion("content")}
          >
            {showCoordinates && (
              <div className="text-secondary mb-2 text-[10px]">
                Region: content ({sidebarWidth},3) {terminalSize.cols - sidebarWidth}x
                {terminalSize.rows - 3}
              </div>
            )}
            <div className="text-primary mb-2 font-bold">{selectedDeploy.name}</div>
            <div className="text-quaternary space-y-1">
              <div>
                Status: <span className={statusColor}>{selectedDeploy.status}</span>
              </div>
              <div>Updated: 2024-01-15 14:32:00 UTC</div>
              {selectedDeploy.status === "running" && (
                <div className="text-secondary mt-2">Building... ████████░░░░░░░░ 52%</div>
              )}
              {selectedDeploy.status === "failed" && (
                <div className="text-primary mt-2 text-[10px]">
                  Error: Test suite failed (3 failures)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const steps = Object.keys(EXPLAINER_STEPS) as ExplainerStep[];

  return (
    <div className="space-y-8">
      {/* Main interactive demo */}
      <div className="grid grid-cols-1 gap-6">
        {/* Left: The simulated TUI */}
        <div className="space-y-4">
          <TerminalWindow>
            <div
              ref={containerRef}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              className="focus:outline-none"
            >
              {renderTUI()}
            </div>
          </TerminalWindow>

          {/* Controls */}
          <div className="flex flex-wrap gap-2 text-sm">
            <button
              onClick={() => setShowCoordinates(!showCoordinates)}
              className={`border px-3 py-1.5 transition-colors ${
                showCoordinates
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-primary hover:border-primary"
              }`}
            >
              {showCoordinates ? "Hide" : "Show"} Coordinates
            </button>
            <button
              onClick={simulateResize}
              disabled={isResizing}
              className={`border px-3 py-1.5 transition-colors ${
                isResizing
                  ? "border-secondary text-secondary"
                  : "border-primary hover:border-primary"
              }`}
            >
              {isResizing ? "Resizing..." : "Simulate Resize"}
            </button>
            <span className="text-quaternary self-center">
              Size: {terminalSize.cols}x{terminalSize.rows}
            </span>
          </div>
        </div>

        {/* Right: Explanation */}
        <div className="space-y-4">
          <div className="space-y-4">
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

              {/* Step-specific visualizations */}
              {currentStep === "layout-system" && (
                <div className="space-y-2 font-mono text-xs">
                  <div className="text-quaternary">// Region data structure</div>
                  <div className="text-primary">
                    {regions.map((r) => (
                      <div key={r.id} className="ml-2">
                        <span className={r.color}>{r.name}</span>:
                        <span className="text-secondary">
                          {" "}
                          x={r.x}, y={r.y}, w={r.width}, h={r.height}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === "focus-management" && (
                <div className="space-y-2">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="border-primary bg-primary/10 h-3 w-3 rounded border-2"></span>
                      <span>
                        Currently focused: <span className="text-primary">{focusedRegion}</span>
                      </span>
                    </div>
                    <div className="text-quaternary mt-2">
                      Focus determines where keystrokes go. The cursor (if any) lives in the focused
                      region.
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "resize-handling" && (
                <div className="space-y-2 font-mono text-xs">
                  <div className="text-quaternary">// Terminal resize sequence</div>
                  <div className="space-y-1">
                    <div>
                      <span className="text-secondary">1.</span> User drags window edge
                    </div>
                    <div>
                      <span className="text-secondary">2.</span> OS sends{" "}
                      <span className="text-secondary">SIGWINCH</span> signal
                    </div>
                    <div>
                      <span className="text-secondary">3.</span> App calls{" "}
                      <span className="text-primary">ioctl(TIOCGWINSZ)</span>
                    </div>
                    <div>
                      <span className="text-secondary">4.</span> Gets new size:{" "}
                      <span className="text-secondary">
                        {terminalSize.cols}×{terminalSize.rows}
                      </span>
                    </div>
                    <div>
                      <span className="text-secondary">5.</span> Recalculate all region bounds
                    </div>
                    <div>
                      <span className="text-secondary">6.</span> Clear screen + redraw everything
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "rendering" && (
                <div className="space-y-2 font-mono text-xs">
                  <div className="text-quaternary">// Escape sequences for TUI rendering</div>
                  <div className="space-y-1">
                    <div>
                      <span className="text-secondary">\x1b[?1049h</span>{" "}
                      <span className="text-quaternary">— Enter alternate screen</span>
                    </div>
                    <div>
                      <span className="text-secondary">\x1b[2J</span>{" "}
                      <span className="text-quaternary">— Clear entire screen</span>
                    </div>
                    <div>
                      <span className="text-secondary">\x1b[H</span>{" "}
                      <span className="text-quaternary">— Move cursor to (1,1)</span>
                    </div>
                    <div>
                      <span className="text-secondary">
                        \x1b[{"{row}"};{"{col}"}H
                      </span>{" "}
                      <span className="text-quaternary">— Move cursor to position</span>
                    </div>
                    <div>
                      <span className="text-secondary">\x1b[?25l</span>{" "}
                      <span className="text-quaternary">— Hide cursor while drawing</span>
                    </div>
                    <div>
                      <span className="text-secondary">\x1b[?25h</span>{" "}
                      <span className="text-quaternary">— Show cursor when done</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed breakdown: How regions work */}
      <div className="space-y-6">
        <h3 className="text-primary text-sm font-medium">Under the Hood: TUI Architecture</h3>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <FeatureBox number={1} title="Layout Engine">
            <p className="text-quaternary text-sm">
              The TUI maintains a tree of regions (like a DOM). Each region knows its bounds and can
              have children. When the container resizes, bounds propagate down the tree.
            </p>
          </FeatureBox>

          <FeatureBox number={2} title="Event Dispatch">
            <p className="text-quaternary text-sm">
              Input events (keys, mouse) go to the focused region first. If unhandled, they bubble
              up. Mouse clicks hit-test against region bounds to determine which region was clicked.
            </p>
          </FeatureBox>

          <FeatureBox number={3} title="Render Loop">
            <p className="text-quaternary text-sm">
              Each region renders to a buffer (2D array of cells). Buffers merge into a final screen
              buffer. Only changed cells get written to the terminal, minimizing escape sequences.
            </p>
          </FeatureBox>
        </div>

        {/* Box drawing character reference */}
        <div className="space-y-3">
          <div className="text-primary text-sm font-medium">Box Drawing Characters</div>
          <div className="grid grid-cols-2 gap-4 font-mono text-sm lg:grid-cols-4">
            <div className="space-y-1">
              <div className="text-quaternary">Corners</div>
              <div>┌ ┐ └ ┘</div>
            </div>
            <div className="space-y-1">
              <div className="text-quaternary">Lines</div>
              <div>─ │ ═ ║</div>
            </div>
            <div className="space-y-1">
              <div className="text-quaternary">T-Junctions</div>
              <div>┬ ┴ ├ ┤</div>
            </div>
            <div className="space-y-1">
              <div className="text-quaternary">Crosses</div>
              <div>┼ ╬ ╪ ╫</div>
            </div>
          </div>
          <p className="text-quaternary text-xs">
            These Unicode characters create the borders you see in TUIs. They're just regular
            characters—the terminal renders them like any other text.
          </p>
        </div>
      </div>

      {/* The cursor position explainer */}
      <CursorPositionDemo />
    </div>
  );
}

// Sub-component for cursor positioning
function CursorPositionDemo() {
  const [cursorPos, setCursorPos] = useState({ row: 1, col: 1 });
  const GRID_ROWS = 5;
  const GRID_COLS = 20;

  return (
    <div className="space-y-4">
      <h3 className="text-primary text-sm font-medium">Cursor Positioning</h3>
      <p className="text-quaternary text-sm">
        The terminal tracks a single cursor position. TUIs constantly move this cursor using escape
        sequences to draw in different regions. Click any cell below to see the escape sequence that
        would move the cursor there.
      </p>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="font-mono text-xs">
          <div
            className="border-primary grid gap-0 border"
            style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}
          >
            {Array(GRID_ROWS)
              .fill(null)
              .map((_, row) =>
                Array(GRID_COLS)
                  .fill(null)
                  .map((_, col) => {
                    const isActive = cursorPos.row === row + 1 && cursorPos.col === col + 1;
                    return (
                      <div
                        key={`${row}-${col}`}
                        onClick={() => setCursorPos({ row: row + 1, col: col + 1 })}
                        className={`border-primary/30 flex h-5 w-4 cursor-pointer items-center justify-center border-r border-b transition-colors ${
                          isActive ? "bg-primary/10 text-primary" : "hover:bg-tertiary"
                        }`}
                      >
                        {isActive ? "█" : "·"}
                      </div>
                    );
                  }),
              )}
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="font-mono text-sm">
            <div className="text-quaternary mb-2 text-xs">Escape sequence to move cursor:</div>
            <div className="text-secondary">
              \x1b[{cursorPos.row};{cursorPos.col}H
            </div>
          </div>
          <div className="font-mono text-sm">
            <div className="text-quaternary mb-2 text-xs">In code:</div>
            <div className="text-primary">
              <span className="text-secondary">printf</span>
              <span className="text-secondary">(</span>
              <span className="text-primary">
                "\033[{cursorPos.row};{cursorPos.col}H"
              </span>
              <span className="text-secondary">)</span>
            </div>
          </div>
          <p className="text-quaternary text-xs">
            Position ({cursorPos.row}, {cursorPos.col}) — Row {cursorPos.row}, Column{" "}
            {cursorPos.col}. Terminal coordinates are 1-indexed (row 1, col 1 is top-left).
          </p>
        </div>
      </div>
    </div>
  );
}
