"use client";

import { Tooltip as BaseUITooltip } from "@base-ui/react/tooltip";
import * as React from "react";

import { cn } from "@/lib/utils";

const TooltipProvider = BaseUITooltip.Provider;

type TooltipProps = React.ComponentProps<typeof BaseUITooltip.Root> & {
  delay?: number;
  closeDelay?: number;
};

function Tooltip({ delay, closeDelay, children, ...props }: TooltipProps) {
  const root = <BaseUITooltip.Root {...props}>{children}</BaseUITooltip.Root>;
  if (delay === undefined && closeDelay === undefined) {
    return root;
  }

  return (
    <TooltipProvider delay={delay} closeDelay={closeDelay}>
      {root}
    </TooltipProvider>
  );
}

const TooltipTrigger = BaseUITooltip.Trigger;

const TooltipPortal = BaseUITooltip.Portal;

const TooltipPositioner = BaseUITooltip.Positioner;

interface TooltipContentProps extends React.ComponentPropsWithoutRef<typeof BaseUITooltip.Popup> {
  sideOffset?: number;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  collisionPadding?: number;
  collisionBoundary?: React.ComponentProps<typeof BaseUITooltip.Positioner>["collisionBoundary"];
  positionMethod?: React.ComponentProps<typeof BaseUITooltip.Positioner>["positionMethod"];
  container?: React.ComponentProps<typeof BaseUITooltip.Portal>["container"];
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof BaseUITooltip.Popup>,
  TooltipContentProps
>(
  (
    {
      className,
      sideOffset = 4,
      side = "top",
      align,
      collisionPadding,
      collisionBoundary,
      positionMethod = "fixed",
      container,
      children,
      ...props
    },
    ref,
  ) => (
    <TooltipPortal container={container}>
      <TooltipPositioner
        className="z-50"
        side={side}
        sideOffset={sideOffset}
        align={align}
        collisionPadding={collisionPadding}
        collisionBoundary={collisionBoundary}
        positionMethod={positionMethod}
      >
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
  ),
);
TooltipContent.displayName = "TooltipContent";

export {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipPositioner,
  TooltipProvider,
  TooltipTrigger,
};
