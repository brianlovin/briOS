"use client";
import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export function Logo({ className, children }: PropsWithChildren<{ className?: string }>) {
  return (
    <span className={cn("flex h-5 w-5 items-center justify-center", className)}>{children}</span>
  );
}
