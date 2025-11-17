import { IconProps } from "./types";

export function Language2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10.25 15.25h-1.5a1 1 0 0 1-1-1V12m2.5-3.25h-1.5a1 1 0 0 0-1 1V12m0 0h2.5m2.5 3.25v-6.5l3.5 6.5v-6.5m3 0v6.5a4 4 0 0 1-4 4h-6.5a4 4 0 0 1-4-4v-6.5a4 4 0 0 1 4-4h6.5a4 4 0 0 1 4 4Z"
      />
    </svg>
  );
}
