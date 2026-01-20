"use client";

import { Dialog as BaseUIDialog } from "@base-ui/react/dialog";
import * as React from "react";

import { Close as CloseIcon } from "@/components/icons/Close";
import { cn } from "@/lib/utils";

export const Dialog = BaseUIDialog.Root;
export const DialogTrigger = BaseUIDialog.Trigger;
export const DialogClose = BaseUIDialog.Close;
export const DialogPortal = BaseUIDialog.Portal;
export const DialogBackdrop = BaseUIDialog.Backdrop;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof BaseUIDialog.Popup>,
  React.ComponentPropsWithoutRef<typeof BaseUIDialog.Popup>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogBackdrop className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
    <BaseUIDialog.Popup
      ref={ref}
      className={cn(
        "bg-elevated dark:shadow-contrast fixed top-1/2 left-1/2 z-50 w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 shadow-md focus:outline-none",
        "transition-[transform,opacity] duration-150",
        "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
        "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
        className,
      )}
      {...props}
    >
      {children}
      <DialogClose
        render={
          <button className="text-secondary hover:text-primary sr-only absolute top-3 right-3" />
        }
      >
        <CloseIcon size={20} />
      </DialogClose>
    </BaseUIDialog.Popup>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-0 sm:space-x-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof BaseUIDialog.Title>,
  React.ComponentPropsWithoutRef<typeof BaseUIDialog.Title>
>(({ className, ...props }, ref) => (
  <BaseUIDialog.Title
    ref={ref}
    className={cn("text-base leading-none font-semibold tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof BaseUIDialog.Description>,
  React.ComponentPropsWithoutRef<typeof BaseUIDialog.Description>
>(({ className, ...props }, ref) => (
  <BaseUIDialog.Description
    ref={ref}
    className={cn("text-secondary text-sm", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";
