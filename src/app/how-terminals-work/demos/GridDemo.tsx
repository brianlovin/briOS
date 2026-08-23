"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { TerminalWindow } from "../ui";
import { Button, InfoPanel } from "../ui";

const ROWS = 12;
const CELL_WIDTH = 12; // pixels per cell
const DEMO_TEXT = "Hello, terminal world!";

export function GridDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(40);
  const [grid, setGrid] = useState<string[][]>(() =>
    Array(ROWS)
      .fill(null)
      .map(() => Array(40).fill(" ")),
  );
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);

  // Measure container and calculate columns
  useEffect(() => {
    const updateCols = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const newCols = Math.max(20, Math.floor(width / CELL_WIDTH));
        setCols(newCols);
        setGrid((prev) => {
          // Preserve existing content when resizing
          return Array(ROWS)
            .fill(null)
            .map((_, rowIdx) =>
              Array(newCols)
                .fill(null)
                .map((_, colIdx) => prev[rowIdx]?.[colIdx] ?? " "),
            );
        });
      }
    };

    updateCols();
    const observer = new ResizeObserver(updateCols);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const clearGrid = useCallback(() => {
    setGrid(
      Array(ROWS)
        .fill(null)
        .map(() => Array(cols).fill(" ")),
    );
    setTypingIndex(0);
    setIsTyping(false);
  }, [cols]);

  const startTyping = useCallback(() => {
    clearGrid();
    setIsTyping(true);
    setTypingIndex(0);
  }, [clearGrid]);

  useEffect(() => {
    if (!isTyping || typingIndex >= DEMO_TEXT.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- stop the typing loop when the demo string is complete
      if (typingIndex >= DEMO_TEXT.length) setIsTyping(false);
      return;
    }
    const timer = setTimeout(() => {
      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]);
        if (typingIndex < cols) newGrid[0]![typingIndex] = DEMO_TEXT[typingIndex]!;
        return newGrid;
      });
      setTypingIndex((i) => i + 1);
    }, 80);
    return () => clearTimeout(timer);
  }, [isTyping, typingIndex, cols]);

  const handleCellClick = (row: number, col: number) => {
    setGrid((prev) => {
      const newGrid = prev.map((r) => [...r]);
      const chars = [" ", "#", "@", "*", "X", "O"];
      const idx = chars.indexOf(newGrid[row]![col]!);
      newGrid[row]![col] = chars[(idx + 1) % chars.length]!;
      return newGrid;
    });
  };

  return (
    <div className="space-y-6">
      <TerminalWindow noPadding>
        <div ref={containerRef} className="w-full">
          <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {grid.map((row, rowIdx) =>
              row.map((char, colIdx) => {
                const isHovered = hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx;
                const isCursor = isTyping && rowIdx === 0 && colIdx === typingIndex;
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={`border-primary/80 flex h-5 cursor-pointer items-center justify-center border-r border-b text-xs transition-colors duration-75 ${isHovered ? "bg-primary/10 ring-primary ring-1 ring-inset" : ""} ${isCursor ? "bg-primary" : "hover:bg-tertiary"}`}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <span className={isCursor ? "text-white dark:text-neutral-950" : ""}>
                      {char}
                    </span>
                  </div>
                );
              }),
            )}
          </div>
        </div>
      </TerminalWindow>

      <InfoPanel>
        {hoveredCell ? (
          <span className="text-tertiary">
            Cell{" "}
            <span className="text-primary font-medium">
              ({hoveredCell.row}, {hoveredCell.col})
            </span>
          </span>
        ) : (
          <span className="text-quaternary">Hover over a cell</span>
        )}
      </InfoPanel>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Button variant="primary" onClick={startTyping}>
          Add text
        </Button>
        <Button variant="secondary" onClick={clearGrid}>
          Clear
        </Button>
        <span className="text-quaternary text-sm">Click cells to draw</span>
      </div>
    </div>
  );
}
