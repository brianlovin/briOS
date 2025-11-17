import { IconProps } from "./types";

export function ChevronDown({ size = 20, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M15.25 10.75L12 14.25L8.75 10.75"
      />
    </svg>
  );
}
