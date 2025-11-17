import { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

export function VisuallyHidden({ className, ...props }: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "clip-[rect(0,0,0,0)] absolute -m-px h-px w-px overflow-hidden border-0 p-0 whitespace-nowrap",
        className,
      )}
      {...props}
    />
  );
}
