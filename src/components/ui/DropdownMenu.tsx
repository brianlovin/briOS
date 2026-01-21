"use client";

import { Menu as BaseUIMenu } from "@base-ui/react/menu";
import * as React from "react";

import { Check } from "@/components/icons/Check";
import { ChevronRight } from "@/components/icons/ChevronRight";
import { Circle } from "@/components/icons/Circle";
import { cn } from "@/lib/utils";

const DropdownMenu = BaseUIMenu.Root;

const DropdownMenuTrigger = BaseUIMenu.Trigger;

const DropdownMenuGroup = BaseUIMenu.Group;

const DropdownMenuPortal = BaseUIMenu.Portal;

const DropdownMenuSub = BaseUIMenu.Root;

const DropdownMenuRadioGroup = BaseUIMenu.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof BaseUIMenu.SubmenuTrigger>,
  React.ComponentPropsWithoutRef<typeof BaseUIMenu.SubmenuTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <BaseUIMenu.SubmenuTrigger
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
  </BaseUIMenu.SubmenuTrigger>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof BaseUIMenu.Popup>,
  React.ComponentPropsWithoutRef<typeof BaseUIMenu.Popup>
>(({ className, ...props }, ref) => (
  <BaseUIMenu.Positioner>
    <BaseUIMenu.Popup
      ref={ref}
      className={cn(
        "border-secondary bg-primary text-primary z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md ring-[0.5px] ring-black/10 dark:ring-white/10",
        "origin-(--transform-origin) transition-[transform,scale,opacity] duration-150",
        "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
        "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
        className,
      )}
      {...props}
    />
  </BaseUIMenu.Positioner>
));
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

interface DropdownMenuContentProps extends React.ComponentPropsWithoutRef<typeof BaseUIMenu.Popup> {
  sideOffset?: number;
}

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof BaseUIMenu.Popup>,
  DropdownMenuContentProps
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPortal>
    <BaseUIMenu.Positioner sideOffset={sideOffset}>
      <BaseUIMenu.Popup
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
    </BaseUIMenu.Positioner>
  </DropdownMenuPortal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof BaseUIMenu.Item>,
  React.ComponentPropsWithoutRef<typeof BaseUIMenu.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <BaseUIMenu.Item
    ref={ref}
    className={cn(
      "data-[highlighted]:bg-secondary data-[highlighted]:text-primary relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof BaseUIMenu.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof BaseUIMenu.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <BaseUIMenu.CheckboxItem
    ref={ref}
    className={cn(
      "data-[highlighted]:bg-secondary data-[highlighted]:text-primary relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <BaseUIMenu.CheckboxItemIndicator>
        <Check className="h-4 w-4" />
      </BaseUIMenu.CheckboxItemIndicator>
    </span>
    {children}
  </BaseUIMenu.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof BaseUIMenu.RadioItem>,
  React.ComponentPropsWithoutRef<typeof BaseUIMenu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <BaseUIMenu.RadioItem
    ref={ref}
    className={cn(
      "data-[highlighted]:bg-secondary data-[highlighted]:text-primary relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <BaseUIMenu.RadioItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </BaseUIMenu.RadioItemIndicator>
    </span>
    {children}
  </BaseUIMenu.RadioItem>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof BaseUIMenu.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof BaseUIMenu.GroupLabel> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <BaseUIMenu.GroupLabel
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof BaseUIMenu.Separator>,
  React.ComponentPropsWithoutRef<typeof BaseUIMenu.Separator>
>(({ className, ...props }, ref) => (
  <BaseUIMenu.Separator
    ref={ref}
    className={cn("bg-secondary -mx-1 my-1 h-px", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
