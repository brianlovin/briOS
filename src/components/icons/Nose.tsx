import { IconProps } from "./types";

export function Nose({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.75 5.75V13c0 1.5-2 1.5-2 3 0 1 2.25 1.25 2.25 1.25s.5 1 2 1 2-1 2-1S16.25 17 16.25 16c0-1.5-2-1.5-2-3V5.75"
      />
    </svg>
  );
}
