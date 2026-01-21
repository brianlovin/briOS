"use client";

import { Tooltip as BaseUITooltip } from "@base-ui/react/tooltip";
import * as React from "react";

import { cn } from "@/lib/utils";

const TooltipProvider = BaseUITooltip.Provider;

const Tooltip = BaseUITooltip.Root;

const TooltipTrigger = BaseUITooltip.Trigger;

const TooltipPortal = BaseUITooltip.Portal;

const TooltipPositioner = BaseUITooltip.Positioner;

interface TooltipContentProps extends React.ComponentPropsWithoutRef<typeof BaseUITooltip.Popup> {
  sideOffset?: number;
  side?: "top" | "bottom" | "left" | "right";
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof BaseUITooltip.Popup>,
  TooltipContentProps
>(({ className, sideOffset = 4, side = "top", children, ...props }, ref) => (
  <TooltipPortal>
    <TooltipPositioner side={side} sideOffset={sideOffset}>
      <BaseUITooltip.Popup
        ref={ref}
        className={cn(
          "border-secondary bg-primary text-primary z-50 overflow-hidden rounded-md border px-3 py-1.5 text-sm shadow-md",
          "origin-(--transform-origin) transition-[transform,scale,opacity] duration-150",
          "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
          className,
        )}
        {...props}
      >
        {children}
      </BaseUITooltip.Popup>
    </TooltipPositioner>
  </TooltipPortal>
));
TooltipContent.displayName = "TooltipContent";

export {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipPositioner,
  TooltipProvider,
  TooltipTrigger,
};
