import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:focus:ring-neutral-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neutral-900 text-neutral-50 hover:bg-neutral-900/80 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/80",
        secondary:
          "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80",
        destructive:
          "border-transparent bg-red-500 text-neutral-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/80",
        outline: "border-neutral-200 text-neutral-900 dark:border-neutral-800 dark:text-neutral-50",
        success:
          "border-transparent bg-green-500 text-neutral-50 hover:bg-green-500/80 dark:bg-green-900 dark:text-neutral-50 dark:hover:bg-green-900/80",
        warning:
          "border-transparent bg-yellow-500 text-neutral-900 hover:bg-yellow-500/80 dark:bg-yellow-900 dark:text-neutral-50 dark:hover:bg-yellow-900/80",
        primary:
          "border-transparent bg-blue-500 text-neutral-50 hover:bg-blue-500/80 dark:bg-blue-500 dark:text-neutral-50 dark:hover:bg-blue-500/80",
      },
      size: {
        sm: "px-1.5 py-0.5 text-xs",
        default: "px-2 py-0.5 text-xs",
        lg: "px-2.5 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
