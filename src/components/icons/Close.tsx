import { IconProps } from "./types";

export function Close({ size = 20, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M17.25 6.75L6.75 17.25"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M6.75 6.75L17.25 17.25"
      />
    </svg>
  );
}
