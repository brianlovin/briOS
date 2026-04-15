"use client";

import type { SortDirection } from "@/atoms/likesSortOrder";
import { ArrowDown } from "@/components/icons/ArrowDown";
import { ArrowUp } from "@/components/icons/ArrowUp";
import { cn } from "@/lib/utils";

interface TableSortHeaderProps {
  label: string;
  direction: SortDirection;
  onToggle: () => void;
  className?: string;
}

export function TableSortHeader({ label, direction, onToggle, className }: TableSortHeaderProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "text-tertiary hover:text-primary inline-flex items-center gap-1 transition-colors",
        direction !== "none" && "text-primary",
        className,
      )}
      aria-pressed={direction !== "none"}
      aria-label={`Sort by ${label.toLowerCase()}`}
      title={`Sort by ${label.toLowerCase()}`}
    >
      <span>{label}</span>
      {direction === "asc" ? (
        <ArrowUp size={14} strokeWidth={2} className="text-secondary shrink-0" />
      ) : null}
      {direction === "desc" ? (
        <ArrowDown size={14} strokeWidth={2} className="text-secondary shrink-0" />
      ) : null}
    </button>
  );
}
