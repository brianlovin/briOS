import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex rounded-full select-none cursor-pointer group/button items-center gap-1.5 justify-center whitespace-nowrap text-[13px] font-medium focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 flex-none dark:focus-visible:ring-neutral-300",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-white hover:bg-neutral-900/90 dark:bg-neutral-700 dark:hover:bg-neutral-600",
        destructive:
          "bg-red-500 text-white hover:bg-red-500/90 dark:bg-red-900 dark:hover:bg-red-900/90",
        outline:
          "border border-neutral-200 bg-white hover:bg-neutral-100 text-secondary hover:text-primary dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800",
        secondary:
          "bg-black/[0.06] text-neutral-900 hover:bg-black/[0.08] dark:bg-white/10 dark:shadow-[inset_0_0.5px_0_0_rgba(255,255,255,0.06),_0_1px_1px_rgba(0,0,0,0.5)] dark:text-neutral-50 dark:hover:bg-white/[0.12]",
        ghost:
          "bg-black/[0] hover:bg-black/[0.08] dark:bg-white/0 dark:hover:bg-white/[0.12] text-primary",
        link: "text-secondary underline-offset-4 hover:underline dark:text-primary",
        primary:
          "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-500 dark:hover:saturate-[101%]",
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3 text-sm",
        default: "px-3.5 h-9 text-base",
        lg: "h-10 px-5 text-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
