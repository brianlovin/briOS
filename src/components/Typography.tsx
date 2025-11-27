import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const PageTitle = forwardRef<
  HTMLHeadingElement,
  { children: React.ReactNode; className?: string }
>(({ children, className }, ref) => {
  return (
    <h1
      ref={ref}
      className={cn(
        "text-3xl leading-[1.2] font-semibold -tracking-[0.64px] md:text-4xl lg:text-5xl",
        className,
      )}
    >
      {children}
    </h1>
  );
});

PageTitle.displayName = "PageTitle";
