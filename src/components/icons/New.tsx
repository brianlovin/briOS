import { IconProps } from "./types";

export function New({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 15.25v-4.5l2.5 4.5v-4.5m5 0h-2.5V13m0 0v2.25h2.5M9.75 13h2.5m7-2.25v4.5L17 12.75l-2.25 2.5v-4.5"
      />
    </svg>
  );
}
