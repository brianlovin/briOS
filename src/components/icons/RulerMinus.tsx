import { IconProps } from "./types";

export function RulerMinus({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10.25 8.75v-3a1 1 0 0 0-1-1h-3.5a1 1 0 0 0-1 1v12.5a1 1 0 0 0 1 1h3.5a1 1 0 0 0 1-1v-3m0-6.5h-1.5m1.5 0V12m0 0h-1.5m1.5 0v3.25m0 0h-1.5M19.25 7h-4.5"
      />
    </svg>
  );
}
