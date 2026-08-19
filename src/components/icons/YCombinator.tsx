import { cn } from "@/lib/utils";

import { IconProps } from "./types";

/** Y Combinator square mark. Follows text color so it inverts in dark mode. */
export function YCombinator({ size = 16, className, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("text-primary rounded-[3px]", className)}
      aria-hidden
      {...rest}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m0 0h24v24h-24zm12.8 13.446 4.339-8.303h-1.871q-2.143 4.018-2.839 5.786l-.375.96-.32-.75c-.96-2.374-1.931-4.348-3.022-6.243l.129.243h-1.984l4.286 8.2v5.52h1.657z"
      />
    </svg>
  );
}
