import { cn } from "@/lib/utils";

import { IconProps } from "./types";

/** Y Combinator square mark. Black in light mode; inverted in dark mode. */
export function YCombinator({ size = 16, className, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("rounded-[3px] dark:invert", className)}
      aria-hidden
      {...rest}
    >
      <path fill="#000" d="M0 0h24v24H0z" />
      <path
        fill="#fff"
        d="M12.7 18.5h-1.4v-6.2L7.1 5.5h1.7l3.2 6.3c.1.2.2.5.3.8h.1c.1-.3.2-.6.3-.8l3.2-6.3h1.7l-4.2 6.8v6.2z"
      />
    </svg>
  );
}
