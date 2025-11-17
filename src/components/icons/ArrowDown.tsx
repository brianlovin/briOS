import { IconProps } from "./types";

export function ArrowDown({ size = 20, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M17.25 13.75L12 19.25L6.75 13.75"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12 18.25V4.75"
      />
    </svg>
  );
}
