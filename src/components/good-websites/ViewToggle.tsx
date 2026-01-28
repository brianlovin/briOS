"use client";

import { Grid } from "@/components/icons/Grid";
import { UnorderedList } from "@/components/icons/UnorderedList";
import { IconButton } from "@/components/ui";
import { cn } from "@/lib/utils";

export type ViewMode = "list" | "gallery";

interface ViewToggleProps {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="border-secondary flex rounded-md border">
      <IconButton
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-r-none border-r-0",
          view === "list" ? "bg-tertiary" : "bg-transparent",
        )}
        onClick={() => onChange("list")}
        aria-label="List view"
        aria-pressed={view === "list"}
      >
        <UnorderedList size={16} />
      </IconButton>
      <IconButton
        variant="ghost"
        size="sm"
        className={cn(
          "border-secondary rounded-l-none border-l",
          view === "gallery" ? "bg-tertiary" : "bg-transparent",
        )}
        onClick={() => onChange("gallery")}
        aria-label="Gallery view"
        aria-pressed={view === "gallery"}
      >
        <Grid size={16} />
      </IconButton>
    </div>
  );
}
