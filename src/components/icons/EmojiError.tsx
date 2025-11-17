import { IconProps } from "./types";

export function EmojiError({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.75 14.75s.75 1 2.25 1 2.25-1 2.25-1m5-3V12A7.25 7.25 0 1 1 12 4.75h.25m5 0v1.5m0 3v-.5M10 11v.01m4-.01v.01"
      />
    </svg>
  );
}
