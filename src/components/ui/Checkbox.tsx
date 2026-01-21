"use client";

import { Checkbox as BaseUICheckbox } from "@base-ui/react/checkbox";
import * as React from "react";

import { Checkmark } from "@/components/icons/Checkmark";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof BaseUICheckbox.Root>,
  React.ComponentPropsWithoutRef<typeof BaseUICheckbox.Root>
>(({ className, ...props }, ref) => (
  <BaseUICheckbox.Root
    ref={ref}
    className={cn(
      "peer ring-offset-primary focus-visible:ring-primary h-4 w-4 shrink-0 rounded-sm border focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-blue-500 data-[checked]:text-white",
      className,
    )}
    {...props}
  >
    <BaseUICheckbox.Indicator className={cn("flex items-center justify-center text-current")}>
      <Checkmark size={16} />
    </BaseUICheckbox.Indicator>
  </BaseUICheckbox.Root>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
