"use client";

import type { LikesSortOrder } from "@/atoms/likesSortOrder";
import { ArrowDown } from "@/components/icons/ArrowDown";
import { ArrowUp } from "@/components/icons/ArrowUp";
import { cn } from "@/lib/utils";

interface LikesSortHeaderProps {
  sortOrder: LikesSortOrder;
  onToggle: () => void;
  className?: string;
}

export function LikesSortHeader({ sortOrder, onToggle, className }: LikesSortHeaderProps) {
  const nextSortOrder = sortOrder === "none" ? "desc" : sortOrder === "desc" ? "asc" : "none";
  const currentLabel =
    sortOrder === "desc"
      ? "most liked first"
      : sortOrder === "asc"
        ? "least liked first"
        : "default order";
  const nextLabel =
    nextSortOrder === "desc"
      ? "most liked first"
      : nextSortOrder === "asc"
        ? "least liked first"
        : "default order";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "text-tertiary hover:text-primary inline-flex items-center gap-1 transition-colors",
        sortOrder !== "none" && "text-primary",
        className,
      )}
      aria-pressed={sortOrder !== "none"}
      aria-label={`Sort by likes. Currently ${currentLabel}. Click to sort ${nextLabel}.`}
      title={`Sort by likes (${nextLabel})`}
    >
      <span>Likes</span>
      {sortOrder === "asc" ? (
        <ArrowUp size={14} strokeWidth={2} className="text-secondary shrink-0" />
      ) : null}
      {sortOrder === "desc" ? (
        <ArrowDown size={14} strokeWidth={2} className="text-secondary shrink-0" />
      ) : null}
    </button>
  );
}
