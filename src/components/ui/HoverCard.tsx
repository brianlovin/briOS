"use client";

import { PreviewCard as BaseUIPreviewCard } from "@base-ui/react/preview-card";
import * as React from "react";

import { cn } from "@/lib/utils";

const HoverCard = BaseUIPreviewCard.Root;

const HoverCardTrigger = BaseUIPreviewCard.Trigger;

interface HoverCardContentProps extends React.ComponentPropsWithoutRef<
  typeof BaseUIPreviewCard.Popup
> {
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof BaseUIPreviewCard.Popup>,
  HoverCardContentProps
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <BaseUIPreviewCard.Portal>
    <BaseUIPreviewCard.Positioner align={align} sideOffset={sideOffset}>
      <BaseUIPreviewCard.Popup
        ref={ref}
        className={cn(
          "border-secondary bg-primary text-primary z-50 w-64 rounded-md border p-4 shadow-md outline-none",
          "origin-(--transform-origin) transition-[transform,scale,opacity] duration-150",
          "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
          className,
        )}
        {...props}
      />
    </BaseUIPreviewCard.Positioner>
  </BaseUIPreviewCard.Portal>
));
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardContent, HoverCardTrigger };
