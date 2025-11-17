import { IconProps } from "./types";

export function BounceLeft({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.75 10.75c3.25 3.25 3.167 6.707 4.222 8.5 1.056-1.793 2.028-6.451 5.278-6.451M6.5 8.25a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5Z"
      />
    </svg>
  );
}
