import { IconProps } from "./types";

export function Pen({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 19.25L9 18.25L18.5625 8.6875C19.46 7.79004 19.46 6.33496 18.5625 5.4375C17.665 4.54004 16.21 4.54004 15.3125 5.4375L5.75 15L4.75 19.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
