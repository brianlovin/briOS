import { IconProps } from "./types";

export function MusicNote({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11.25 16.5a2.75 2.75 0 1 0-5.5 0 2.75 2.75 0 0 0 5.5 0Zm0 0V4.75c7 0 7 6.5 7 6.5"
      />
    </svg>
  );
}
