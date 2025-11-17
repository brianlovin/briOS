import { IconProps } from "./types";

export function RotateAntiClockwise({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13 18.25A6.25 6.25 0 1 0 6.75 12v2.385m2.5-1.635L7 15.25l-2.25-2.5"
      />
    </svg>
  );
}
