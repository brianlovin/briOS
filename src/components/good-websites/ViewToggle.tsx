"use client";

import { Grid } from "@/components/icons/Grid";
import { UnorderedList } from "@/components/icons/UnorderedList";
import { cn } from "@/lib/utils";

export type ViewMode = "list" | "gallery";

interface ViewToggleProps {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="dark:shadow-contrast bg-primary flex h-9 items-center gap-0.5 rounded-lg px-1 shadow-xs ring ring-black/10 dark:bg-white/5">
      <button
        type="button"
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md",
          view === "list"
            ? "text-brand bg-[rgba(240,104,0,0.1)]"
            : "text-quaternary hover:text-tertiary",
        )}
        onClick={() => onChange("list")}
        aria-label="List view"
        aria-pressed={view === "list"}
      >
        <UnorderedList size={20} />
      </button>
      <button
        type="button"
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md",
          view === "gallery"
            ? "text-brand bg-[rgba(240,104,0,0.1)]"
            : "text-quaternary hover:text-tertiary",
        )}
        onClick={() => onChange("gallery")}
        aria-label="Gallery view"
        aria-pressed={view === "gallery"}
      >
        <Grid size={20} filled={view === "gallery"} />
      </button>
    </div>
  );
}
