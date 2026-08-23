"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { TerminalWindow } from "../ui";
import { StepDotsNavigation } from "../ui";

type SelectionMode = "terminal" | "app";

const SAMPLE_TEXT = [
  "~/projects $ ls -la",
  "total 24",
  "drwxr-xr-x  5 user staff  160 Jan  7 10:00 .",
  "drwxr-xr-x 12 user staff  384 Jan  6 15:30 ..",
  "-rw-r--r--  1 user staff  234 Jan  7 09:45 README.md",
  "-rw-r--r--  1 user staff 1024 Jan  7 10:00 index.ts",
  "drwxr-xr-x  3 user staff   96 Jan  5 14:20 src",
  '~/projects $ echo "Hello, World!"',
  "Hello, World!",
  "~/projects $ _",
];

interface CursorPosition {
  row: number;
  col: number;
}

type ExplainerStep =
  | "overview"
  | "terminal-selection"
  | "cursor-positioning"
  | "option-click"
  | "why-different";

const EXPLAINER_STEPS: Record<ExplainerStep, { title: string; description: string }> = {
  overview: {
    title: "Two Types of Selection",
    description:
      "In terminals, there are two completely different 'selections': terminal-level text selection (what the terminal emulator handles) and cursor position (where the app thinks the cursor is). They're independent and often confuse people.",
  },
  "terminal-selection": {
    title: "Terminal-Level Selection",
    description:
      "When you click and drag in a terminal, the terminal emulator (iTerm, Terminal.app, etc.) handles selection. It's highlighting text on screen for copy/paste. The running program doesn't know you're selecting—it just sees characters on a grid.",
  },
  "cursor-positioning": {
    title: "App Cursor Position",
    description:
      "The blinking cursor in vim or your shell prompt is controlled by the app, not the terminal. The app sends escape sequences like ESC[5;10H to move the cursor to row 5, column 10. Clicking on the screen doesn't automatically move this cursor.",
  },
  "option-click": {
    title: "Option+Click: The Bridge",
    description:
      "Some terminals support Option+Click (or Alt+Click) to move the cursor. When you do this, the terminal calculates where you clicked and sends arrow key sequences to move the cursor there. It's simulating keypresses, not directly moving the cursor!",
  },
  "why-different": {
    title: "Why They're Separate",
    description:
      "The terminal is just a character display. It doesn't know if you're in vim (where clicking should move cursor) or running 'cat' (where there's no cursor). The app must opt into mouse handling. Without it, clicks are just for terminal-level selection.",
  },
};

export function TextSelectionDemo() {
  const [mode, setMode] = useState<SelectionMode>("terminal");
  const [cursorPos, setCursorPos] = useState<CursorPosition>({
    row: 9,
    col: 15,
  });
  const [selectedRange, setSelectedRange] = useState<{
    start: CursorPosition;
    end: CursorPosition;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<CursorPosition | null>(null);
  const [showArrowKeys, setShowArrowKeys] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<ExplainerStep>("overview");
  const gridRef = useRef<HTMLDivElement>(null);

  const handleCellMouseDown = useCallback(
    (row: number, col: number, e: React.MouseEvent) => {
      e.preventDefault();

      if (mode === "terminal") {
        // Terminal selection mode - start drag selection
        setIsDragging(true);
        setDragStart({ row, col });
        setSelectedRange({ start: { row, col }, end: { row, col } });
      } else {
        // App mode with option click - show cursor movement
        if (e.altKey) {
          // Option+click - calculate arrow keys needed
          const arrows: string[] = [];
          const rowDiff = row - cursorPos.row;
          const colDiff = col - cursorPos.col;

          if (rowDiff > 0) for (let i = 0; i < rowDiff; i++) arrows.push("↓");
          if (rowDiff < 0) for (let i = 0; i < -rowDiff; i++) arrows.push("↑");
          if (colDiff > 0) for (let i = 0; i < colDiff; i++) arrows.push("→");
          if (colDiff < 0) for (let i = 0; i < -colDiff; i++) arrows.push("←");

          setShowArrowKeys(arrows);
          setCursorPos({ row, col });

          // Clear arrow display after animation
          setTimeout(() => setShowArrowKeys([]), 1500);
        }
      }
    },
    [mode, cursorPos],
  );

  const handleCellMouseMove = useCallback(
    (row: number, col: number) => {
      if (isDragging && dragStart && mode === "terminal") {
        setSelectedRange({ start: dragStart, end: { row, col } });
      }
    },
    [isDragging, dragStart, mode],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);

  const isInSelection = useCallback(
    (row: number, col: number): boolean => {
      if (!selectedRange) return false;

      // Normalize selection direction (start should be before end in reading order)
      let startRow = selectedRange.start.row;
      let startCol = selectedRange.start.col;
      let endRow = selectedRange.end.row;
      let endCol = selectedRange.end.col;

      // Swap if selection is backwards
      if (startRow > endRow || (startRow === endRow && startCol > endCol)) {
        [startRow, endRow] = [endRow, startRow];
        [startCol, endCol] = [endCol, startCol];
      }

      // Line-based selection like real terminals:
      // - First row: from startCol to end of line
      // - Middle rows: entire line
      // - Last row: from start to endCol
      if (startRow === endRow) {
        // Single row selection
        return row === startRow && col >= startCol && col <= endCol;
      } else {
        // Multi-row selection
        if (row === startRow) {
          // First row: from start column to end of line
          return col >= startCol;
        } else if (row === endRow) {
          // Last row: from start of line to end column
          return col <= endCol;
        } else if (row > startRow && row < endRow) {
          // Middle rows: entire line
          return true;
        }
        return false;
      }
    },
    [selectedRange],
  );

  const getSelectedText = useCallback((): string => {
    if (!selectedRange) return "";

    // Normalize selection direction
    let startRow = selectedRange.start.row;
    let startCol = selectedRange.start.col;
    let endRow = selectedRange.end.row;
    let endCol = selectedRange.end.col;

    if (startRow > endRow || (startRow === endRow && startCol > endCol)) {
      [startRow, endRow] = [endRow, startRow];
      [startCol, endCol] = [endCol, startCol];
    }

    const lines: string[] = [];
    for (let r = startRow; r <= endRow; r++) {
      const line = SAMPLE_TEXT[r] || "";
      if (startRow === endRow) {
        // Single row
        lines.push(line.slice(startCol, endCol + 1));
      } else if (r === startRow) {
        // First row: from startCol to end
        lines.push(line.slice(startCol));
      } else if (r === endRow) {
        // Last row: from start to endCol
        lines.push(line.slice(0, endCol + 1));
      } else {
        // Middle rows: entire line
        lines.push(line);
      }
    }
    return lines.join("\n");
  }, [selectedRange]);

  const steps = Object.keys(EXPLAINER_STEPS) as ExplainerStep[];
  const stepContent = EXPLAINER_STEPS[currentStep];

  // Get max line length for grid
  const maxCols = Math.max(...SAMPLE_TEXT.map((line) => line.length), 40);

  return (
    <div className="space-y-8">
      {/* Interactive Demo */}
      <div className="space-y-4">
        <TerminalWindow>
          <div className="space-y-4">
            {/* Mode Toggle */}
            <div className="flex items-center gap-4 text-sm">
              <span className="text-quaternary">Mode:</span>
              <button
                onClick={() => {
                  setMode("terminal");
                  setSelectedRange(null);
                  setShowArrowKeys([]);
                }}
                className={`px-3 py-1 transition-colors ${
                  mode === "terminal"
                    ? "bg-tertiary text-white dark:text-neutral-950"
                    : "border-primary hover:border-primary border"
                }`}
              >
                Terminal Selection
              </button>
              <button
                onClick={() => {
                  setMode("app");
                  setSelectedRange(null);
                }}
                className={`px-3 py-1 transition-colors ${
                  mode === "app"
                    ? "bg-primary text-white dark:text-neutral-950"
                    : "border-primary hover:border-primary border"
                }`}
              >
                App Cursor (Option+Click)
              </button>
            </div>

            {/* Terminal Grid */}
            <div
              ref={gridRef}
              className="bg-secondary border-primary overflow-x-auto rounded border p-4 font-mono text-sm"
              style={{ userSelect: "none" }}
            >
              {SAMPLE_TEXT.map((line, row) => (
                <div key={row} className="flex whitespace-pre">
                  {Array(maxCols)
                    .fill(null)
                    .map((_, col) => {
                      const char = line[col] || " ";
                      const isSelected = mode === "terminal" && isInSelection(row, col);
                      const isCursor =
                        mode === "app" && cursorPos.row === row && cursorPos.col === col;

                      return (
                        <span
                          key={col}
                          onMouseDown={(e) => handleCellMouseDown(row, col, e)}
                          onMouseMove={() => handleCellMouseMove(row, col)}
                          className={`inline-block h-[1.4em] w-[0.6em] text-center leading-[1.4em] transition-colors ${isSelected ? "bg-white text-black" : ""} ${isCursor ? "bg-primary text-white dark:text-neutral-950" : ""} ${mode === "terminal" ? "cursor-text" : "cursor-pointer"} `}
                        >
                          {char === "_" && row === SAMPLE_TEXT.length - 1 && col === 15 ? (
                            <span>_</span>
                          ) : (
                            char
                          )}
                        </span>
                      );
                    })}
                </div>
              ))}
            </div>

            {/* Status Area */}
            <div className="min-h-[80px] rounded">
              {mode === "terminal" ? (
                selectedRange ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-quaternary text-sm">Selected:</span>
                      <code className="text-secondary text-sm">
                        ({selectedRange.start.row},{selectedRange.start.col}) to (
                        {selectedRange.end.row},{selectedRange.end.col})
                      </code>
                    </div>
                    <div className="text-quaternary text-sm">
                      The app doesn't know about this selection. It's handled entirely by the
                      terminal emulator for copy/paste.
                    </div>
                    {getSelectedText() && (
                      <div className="mt-2">
                        <span className="text-quaternary text-sm">Would copy: </span>
                        <code className="text-secondary bg-tertiary px-2 py-1 text-xs">
                          {getSelectedText().slice(0, 50)}
                          {getSelectedText().length > 50 ? "..." : ""}
                        </code>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-quaternary p-4 text-center text-sm text-pretty">
                    Click and drag to select text. This is handled by the terminal, not the running
                    program.
                  </div>
                )
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-quaternary text-sm">Cursor position:</span>
                    <code className="text-primary text-sm">
                      row {cursorPos.row + 1}, col {cursorPos.col + 1}
                    </code>
                  </div>
                  {showArrowKeys.length > 0 ? (
                    <div className="space-y-2">
                      <div className="text-quaternary text-sm">Arrow keys sent by terminal:</div>
                      <div className="flex flex-wrap gap-1">
                        {showArrowKeys.map((arrow, i) => (
                          <span
                            key={i}
                            className="bg-tertiary/20 text-secondary inline-block px-2 py-0.5 font-mono text-xs"
                          >
                            {arrow}
                          </span>
                        ))}
                      </div>
                      <div className="text-quaternary text-xs">
                        The terminal simulates {showArrowKeys.length} keypresses to move the cursor!
                      </div>
                    </div>
                  ) : (
                    <div className="text-quaternary text-sm">
                      Hold <kbd className="bg-tertiary rounded px-1">Option</kbd> and click anywhere
                      to move the cursor. Watch the arrow key simulation!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </TerminalWindow>
      </div>

      {/* How it works explanation */}
      <div className="space-y-4">
        <div className="bg-tertiary border-primary space-y-4 border px-4 py-4">
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

            {currentStep === "terminal-selection" && (
              <div className="bg-tertiary space-y-2 p-3 font-mono text-xs">
                <div className="text-quaternary">// Terminal emulator handles selection</div>
                <div className="space-y-1">
                  <div>
                    <span className="text-secondary">1.</span> You click at position (5, 10)
                  </div>
                  <div>
                    <span className="text-secondary">2.</span> Terminal emulator stores selection
                    start
                  </div>
                  <div>
                    <span className="text-secondary">3.</span> You drag to (5, 20)
                  </div>
                  <div>
                    <span className="text-secondary">4.</span> Terminal highlights cells &amp;
                    stores in clipboard
                  </div>
                  <div className="text-quaternary mt-2">// The running program sees NOTHING</div>
                  <div className="text-quaternary">// (unless it enabled mouse tracking)</div>
                </div>
              </div>
            )}

            {currentStep === "cursor-positioning" && (
              <div className="bg-tertiary space-y-2 p-3 font-mono text-xs">
                <div className="text-quaternary">// App controls cursor with escape sequences</div>
                <div className="space-y-1">
                  <div>
                    <span className="text-primary">ESC[H</span>{" "}
                    <span className="text-quaternary">— move cursor to (1,1)</span>
                  </div>
                  <div>
                    <span className="text-primary">ESC[5;10H</span>{" "}
                    <span className="text-quaternary">— move to row 5, col 10</span>
                  </div>
                  <div>
                    <span className="text-primary">ESC[A</span>{" "}
                    <span className="text-quaternary">— move cursor up one line</span>
                  </div>
                  <div>
                    <span className="text-primary">ESC[C</span>{" "}
                    <span className="text-quaternary">— move cursor right one col</span>
                  </div>
                  <div className="text-quaternary mt-2">// Terminal just obeys these commands</div>
                  <div className="text-quaternary">// It doesn't move cursor on click!</div>
                </div>
              </div>
            )}

            {currentStep === "option-click" && (
              <div className="bg-tertiary space-y-2 p-3 font-mono text-xs">
                <div className="text-quaternary">// Option+Click at (5, 15), cursor at (3, 5)</div>
                <div className="space-y-1">
                  <div>
                    <span className="text-secondary">1.</span> Terminal calculates: need to go down
                    2, right 10
                  </div>
                  <div>
                    <span className="text-secondary">2.</span> Terminal sends:{" "}
                    <span className="text-secondary">ESC[B ESC[B</span>{" "}
                    <span className="text-quaternary">(2x down)</span>
                  </div>
                  <div>
                    <span className="text-secondary">3.</span> Terminal sends:{" "}
                    <span className="text-secondary">ESC[C ESC[C ...</span>{" "}
                    <span className="text-quaternary">(10x right)</span>
                  </div>
                  <div>
                    <span className="text-secondary">4.</span> App receives arrow keys, moves its
                    cursor
                  </div>
                  <div className="text-quaternary mt-2">// It's simulating 12 keypresses!</div>
                </div>
              </div>
            )}

            {currentStep === "why-different" && (
              <div className="bg-tertiary space-y-2 p-3 font-mono text-xs">
                <div className="text-quaternary">// Terminal doesn't know what you're running:</div>
                <div className="mt-2 space-y-1">
                  <div>
                    <span className="text-secondary">$ vim file.txt</span>{" "}
                    <span className="text-quaternary">← click should move cursor</span>
                  </div>
                  <div>
                    <span className="text-secondary">$ cat longfile.txt</span>{" "}
                    <span className="text-quaternary">← no cursor to move</span>
                  </div>
                  <div>
                    <span className="text-secondary">$ python</span>{" "}
                    <span className="text-quaternary">← cursor in REPL prompt</span>
                  </div>
                  <div>
                    <span className="text-secondary">$ htop</span>{" "}
                    <span className="text-quaternary">← click selects process</span>
                  </div>
                  <div className="text-quaternary mt-2">// Each app handles mouse differently</div>
                  <div className="text-quaternary">// So terminal can't assume anything!</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Insight Box */}
      <div className="border-primary bg-tertiary space-y-6 border p-6">
        <h3 className="text-primary text-sm font-bold">
          Why You Can't Just Click to Move the Cursor
        </h3>

        <div className="flex flex-col items-stretch gap-4 md:flex-row">
          <div className="bg-tertiary flex-1 p-4">
            <div className="text-primary mb-2 text-sm font-bold">What You Expect</div>
            <div className="text-quaternary text-xs">
              Click at position → cursor moves there instantly, like in a text editor or browser.
            </div>
          </div>
          <div className="text-quaternary flex items-center justify-center text-2xl">≠</div>
          <div className="bg-tertiary flex-1 p-4">
            <div className="text-primary mb-2 text-sm font-bold">What Actually Happens</div>
            <div className="text-quaternary text-xs">
              Click → terminal shows selection OR sends mouse event to app (if enabled) → app
              decides what to do.
            </div>
          </div>
        </div>

        <div className="text-quaternary text-sm">
          The terminal is a dumb display. It shows characters where the app tells it to. Cursor
          position is owned by the running program, and the terminal can only influence it by
          sending keypress events that the program interprets.
        </div>
      </div>
    </div>
  );
}
