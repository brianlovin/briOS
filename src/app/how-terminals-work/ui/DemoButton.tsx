"use client";

import { Button as UiButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface DemoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "toggle";
  size?: "sm" | "md";
  active?: boolean;
}

export function DemoButton({
  variant = "secondary",
  size = "md",
  active = false,
  className = "",
  children,
  ...props
}: DemoButtonProps) {
  const mappedVariant =
    variant === "primary" ? "default" : variant === "toggle" && active ? "secondary" : "outline";

  return (
    <UiButton
      variant={mappedVariant}
      size={size === "sm" ? "sm" : "default"}
      className={cn(className)}
      {...props}
    >
      {children}
    </UiButton>
  );
}

export { DemoButton as Button };
