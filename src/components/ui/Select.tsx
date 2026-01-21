"use client";

import { Select as BaseUISelect } from "@base-ui/react/select";
import * as React from "react";

import { Checkmark } from "@/components/icons/Checkmark";
import { ChevronDown } from "@/components/icons/ChevronDown";
import { ChevronUp } from "@/components/icons/ChevronUp";
import { cn } from "@/lib/utils";

const Select = BaseUISelect.Root;

const SelectGroup = BaseUISelect.Group;

const SelectValue = BaseUISelect.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof BaseUISelect.Trigger>,
  React.ComponentPropsWithoutRef<typeof BaseUISelect.Trigger>
>(({ className, children, ...props }, ref) => (
  <BaseUISelect.Trigger
    ref={ref}
    className={cn(
      "dark:shadow-contrast bg-primary ring-offset-primary placeholder:text-tertiary flex h-9 items-center justify-between rounded-lg pr-2 pl-3.5 text-left text-[15px] font-medium shadow-xs ring ring-black/10 focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 [&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
    <BaseUISelect.Icon>
      <ChevronDown className="opacity-50" size={24} />
    </BaseUISelect.Icon>
  </BaseUISelect.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof BaseUISelect.ScrollUpArrow>,
  React.ComponentPropsWithoutRef<typeof BaseUISelect.ScrollUpArrow>
>(({ className, ...props }, ref) => (
  <BaseUISelect.ScrollUpArrow
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </BaseUISelect.ScrollUpArrow>
));
SelectScrollUpButton.displayName = "SelectScrollUpButton";

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof BaseUISelect.ScrollDownArrow>,
  React.ComponentPropsWithoutRef<typeof BaseUISelect.ScrollDownArrow>
>(({ className, ...props }, ref) => (
  <BaseUISelect.ScrollDownArrow
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </BaseUISelect.ScrollDownArrow>
));
SelectScrollDownButton.displayName = "SelectScrollDownButton";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof BaseUISelect.Popup>,
  React.ComponentPropsWithoutRef<typeof BaseUISelect.Popup>
>(({ className, children, ...props }, ref) => (
  <BaseUISelect.Portal>
    <BaseUISelect.Positioner sideOffset={4} className="z-[100]">
      <BaseUISelect.Popup
        ref={ref}
        className={cn(
          "dark:shadow-contrast bg-primary text-primary relative max-h-96 min-w-32 overflow-hidden rounded-xl border shadow-md dark:bg-neutral-800",
          "origin-(--transform-origin) transition-[transform,scale,opacity] duration-150",
          "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
          "data-[side=bottom]:translate-y-1",
          className,
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <BaseUISelect.List className="p-1 outline-none">{children}</BaseUISelect.List>
        <SelectScrollDownButton />
      </BaseUISelect.Popup>
    </BaseUISelect.Positioner>
  </BaseUISelect.Portal>
));
SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof BaseUISelect.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof BaseUISelect.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseUISelect.GroupLabel
    ref={ref}
    className={cn("py-1.5 pr-2 pl-8 font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

const SelectItem = React.forwardRef<
  React.ElementRef<typeof BaseUISelect.Item>,
  React.ComponentPropsWithoutRef<typeof BaseUISelect.Item>
>(({ className, children, ...props }, ref) => (
  <BaseUISelect.Item
    ref={ref}
    className={cn(
      "data-[highlighted]:bg-tertiary data-[highlighted]:text-primary relative flex w-full cursor-pointer items-center rounded-lg py-1.5 pr-2 pl-8 text-base outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:data-[highlighted]:bg-white/10",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <BaseUISelect.ItemIndicator>
        <Checkmark size={28} />
      </BaseUISelect.ItemIndicator>
    </span>

    <BaseUISelect.ItemText>{children}</BaseUISelect.ItemText>
  </BaseUISelect.Item>
));
SelectItem.displayName = "SelectItem";

const SelectSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-secondary -mx-1 my-1 h-px", className)} {...props} />
);
SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
