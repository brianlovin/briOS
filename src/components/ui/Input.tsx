"use client";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, autoComplete = "off", type = "text", ...props }, ref) => {
    return (
      <input
        autoComplete={autoComplete}
        type={type}
        className={cn(
          "bg-secondary placeholder:text-quaternary flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-[15px] file:font-medium focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-[15px] dark:bg-white/5",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
