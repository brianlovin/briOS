"use client";

import { ContextMenu as BaseUIContextMenu } from "@base-ui/react/context-menu";
import * as React from "react";

import { Check } from "@/components/icons/Check";
import { ChevronRight } from "@/components/icons/ChevronRight";
import { Circle } from "@/components/icons/Circle";
import { cn } from "@/lib/utils";

const ContextMenu = BaseUIContextMenu.Root;

const ContextMenuTrigger = BaseUIContextMenu.Trigger;

const ContextMenuGroup = BaseUIContextMenu.Group;

const ContextMenuPortal = BaseUIContextMenu.Portal;

const ContextMenuSub = BaseUIContextMenu.Root;

const ContextMenuRadioGroup = BaseUIContextMenu.RadioGroup;

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof BaseUIContextMenu.SubmenuTrigger>,
  React.ComponentPropsWithoutRef<typeof BaseUIContextMenu.SubmenuTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <BaseUIContextMenu.SubmenuTrigger
    ref={ref}
    className={cn(
      "data-[highlighted]:bg-secondary data-[open]:bg-secondary flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </BaseUIContextMenu.SubmenuTrigger>
));
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof BaseUIContextMenu.Popup>,
  React.ComponentPropsWithoutRef<typeof BaseUIContextMenu.Popup>
>(({ className, ...props }, ref) => (
  <BaseUIContextMenu.Positioner>
    <BaseUIContextMenu.Popup
      ref={ref}
      className={cn(
        "border-secondary bg-primary text-primary z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg",
        "origin-(--transform-origin) transition-[transform,scale,opacity] duration-150",
        "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
        "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
        className,
      )}
      {...props}
    />
  </BaseUIContextMenu.Positioner>
));
ContextMenuSubContent.displayName = "ContextMenuSubContent";

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof BaseUIContextMenu.Popup>,
  React.ComponentPropsWithoutRef<typeof BaseUIContextMenu.Popup>
>(({ className, ...props }, ref) => (
  <ContextMenuPortal>
    <BaseUIContextMenu.Positioner>
      <BaseUIContextMenu.Popup
        ref={ref}
        className={cn(
          "border-secondary bg-primary text-primary z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md",
          "origin-(--transform-origin) transition-[transform,scale,opacity] duration-150",
          "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
          className,
        )}
        {...props}
      />
    </BaseUIContextMenu.Positioner>
  </ContextMenuPortal>
));
ContextMenuContent.displayName = "ContextMenuContent";

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof BaseUIContextMenu.Item>,
  React.ComponentPropsWithoutRef<typeof BaseUIContextMenu.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <BaseUIContextMenu.Item
    ref={ref}
    className={cn(
      "data-[highlighted]:bg-secondary data-[highlighted]:text-primary relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
ContextMenuItem.displayName = "ContextMenuItem";

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof BaseUIContextMenu.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof BaseUIContextMenu.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <BaseUIContextMenu.CheckboxItem
    ref={ref}
    className={cn(
      "data-[highlighted]:bg-secondary data-[highlighted]:text-primary relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <BaseUIContextMenu.CheckboxItemIndicator>
        <Check className="h-4 w-4" />
      </BaseUIContextMenu.CheckboxItemIndicator>
    </span>
    {children}
  </BaseUIContextMenu.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof BaseUIContextMenu.RadioItem>,
  React.ComponentPropsWithoutRef<typeof BaseUIContextMenu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <BaseUIContextMenu.RadioItem
    ref={ref}
    className={cn(
      "data-[highlighted]:bg-secondary data-[highlighted]:text-primary relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <BaseUIContextMenu.RadioItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </BaseUIContextMenu.RadioItemIndicator>
    </span>
    {children}
  </BaseUIContextMenu.RadioItem>
));
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof BaseUIContextMenu.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof BaseUIContextMenu.GroupLabel> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <BaseUIContextMenu.GroupLabel
    ref={ref}
    className={cn("text-primary px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
ContextMenuLabel.displayName = "ContextMenuLabel";

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof BaseUIContextMenu.Separator>,
  React.ComponentPropsWithoutRef<typeof BaseUIContextMenu.Separator>
>(({ className, ...props }, ref) => (
  <BaseUIContextMenu.Separator
    ref={ref}
    className={cn("bg-secondary -mx-1 my-1 h-px", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = "ContextMenuSeparator";

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn("text-tertiary ml-auto text-xs tracking-widest", className)} {...props} />
  );
};
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
