import { IconProps } from "./types";

export function Shorts({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16.373 6.75H7.627a1 1 0 0 0-.977.787l-1.9 8.713h4.586a1 1 0 0 0 .901-.566l.862-1.788a1 1 0 0 1 1.802 0l.862 1.788a1 1 0 0 0 .9.566h4.587l-1.9-8.713a1 1 0 0 0-.977-.787Z"
      />
    </svg>
  );
}
