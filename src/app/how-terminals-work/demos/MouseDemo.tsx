"use client";

import { useEffect, useRef, useState } from "react";

import { encodeMouseClick } from "../lib/sequences";
import { TerminalWindow } from "../ui";

const GRID_ROWS = 10;
const CELL_WIDTH = 20; // pixels per cell

interface ClickInfo {
  x: number;
  y: number;
  button: number;
  sequence: string;
  bytes: string;
}

export function MouseDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(20);
  const [lastClick, setLastClick] = useState<ClickInfo | null>(null);
  const [mouseEnabled, setMouseEnabled] = useState(true);

  // Measure container and calculate columns
  useEffect(() => {
    const updateCols = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const newCols = Math.max(10, Math.floor(width / CELL_WIDTH));
        setCols(newCols);
      }
    };

    updateCols();
    const observer = new ResizeObserver(updateCols);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleCellClick = (row: number, col: number, e: React.MouseEvent) => {
    if (!mouseEnabled) return;
    setLastClick(encodeMouseClick(row, col, e.button));
  };

  return (
    <div className="space-y-6">
      <TerminalWindow>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={mouseEnabled}
                onChange={(e) => setMouseEnabled(e.target.checked)}
                className="accent-primary h-4 w-4"
              />
              <span className="text-tertiary">
                Mouse tracking{" "}
                <span className={mouseEnabled ? "text-primary" : "text-quaternary"}>
                  {mouseEnabled ? "enabled" : "disabled"}
                </span>
              </span>
            </label>
            <span className="text-quaternary text-xs">
              <code className="text-secondary">^[[?1000h</code>
            </span>
          </div>

          <div
            ref={containerRef}
            className={`border-primary grid w-full gap-0 border ${mouseEnabled ? "" : "opacity-50"}`}
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {Array(GRID_ROWS)
              .fill(null)
              .map((_, row) =>
                Array(cols)
                  .fill(null)
                  .map((_, col) => {
                    const isClicked = lastClick?.x === col + 1 && lastClick?.y === row + 1;
                    return (
                      <div
                        key={`${row}-${col}`}
                        onClick={(e) => handleCellClick(row, col, e)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleCellClick(row, col, e);
                        }}
                        className={`border-primary/80 flex h-5 cursor-crosshair items-center justify-center border-r border-b text-xs transition-colors ${isClicked ? "bg-primary text-white dark:text-neutral-950" : "hover:bg-tertiary"}`}
                      >
                        {isClicked ? "×" : ""}
                      </div>
                    );
                  }),
              )}
          </div>

          {lastClick && mouseEnabled ? (
            <div className="space-y-3 p-4">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="text-quaternary mb-1 text-xs uppercase">Position</div>
                  <div className="text-primary">
                    ({lastClick.x}, {lastClick.y})
                  </div>
                </div>
                <div>
                  <div className="text-quaternary mb-1 text-xs uppercase">Button</div>
                  <div className="text-secondary">
                    {["Left", "Middle", "Right"][lastClick.button]}
                  </div>
                </div>
                <div>
                  <div className="text-quaternary mb-1 text-xs uppercase">Sequence</div>
                  <code className="text-secondary">{lastClick.sequence}</code>
                </div>
              </div>
              <div className="text-center text-sm">
                <span className="text-quaternary">Bytes: </span>
                <code className="text-secondary">{lastClick.bytes}</code>
              </div>
            </div>
          ) : (
            <div className="text-tertiary py-4 text-center text-sm">
              {mouseEnabled
                ? "Click anywhere in the grid"
                : "Enable mouse tracking to capture clicks"}
            </div>
          )}
        </div>
      </TerminalWindow>

      <div className="text-tertiary text-sm">
        By default, terminals don't send mouse events. Programs request mouse tracking, then clicks
        become escape sequences with coordinates.
      </div>
    </div>
  );
}
