import { IconProps } from "./types";

export function BoneBroken({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10 5.75v1.5M5.75 10h1.5m9.98-3.23a1.75 1.75 0 1 0-2.893 1.036L12 10.001l.928 2.928L10 12l-2.193 2.337a1.75 1.75 0 1 0-1.036 2.893 1.75 1.75 0 1 0 2.893-1.037l6.529-6.53A1.75 1.75 0 1 0 17.23 6.77Z"
      />
    </svg>
  );
}
