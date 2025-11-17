import { IconProps } from "./types";

export function CrackedEgg({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M15 6.203 12.75 9.25l2.5 2-1.5 3m4.5-1.214c0 4.004-2.798 6.214-6.25 6.214s-6.25-2.21-6.25-6.214c0-2.562 1.493-5.238 3.25-6.833.99-.898 2.062-1.453 3-1.453 2.604 0 6.25 4.282 6.25 8.286Z"
      />
    </svg>
  );
}
