import { IconProps } from "./types";

export function NoseBleed({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.75 4.75V9c0 1.5-2 1.5-2 3 0 1 2.25 1.25 2.25 1.25s.5 1 2 1 2-1 2-1S16.25 13 16.25 12c0-1.5-2-1.5-2-3V4.75m.75 11c-.417.389-1.25 1.75-1.25 2.333 0 .584.625 1.167 1.25 1.167s1.25-.583 1.25-1.167c0-.583-1.25-2.333-1.25-2.333Z"
      />
    </svg>
  );
}
