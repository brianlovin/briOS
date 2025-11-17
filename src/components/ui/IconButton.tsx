import { cn } from "@/lib/utils";

import { type ButtonProps, buttonVariants } from "./Button";
import { Button } from "./Button";

export function IconButton({
  className,
  variant = "ghost",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <Button
      className={cn(
        buttonVariants({ variant, className, size }),
        {
          "h-6 w-6 p-0": size === "xs",
          "h-7 w-7 p-0": size === "sm",
          "h-[30px] w-[30px] p-0": size === "default",
          "h-9 w-9 p-0": size === "lg",
        },
        className,
      )}
      {...props}
    />
  );
}
