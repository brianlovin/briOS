import { IconProps } from "./types";

export function AppleWatchUltra({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16.5 9.75h.75v4.5h-.75m-1.75 5 .5-2.75m-6 2.75-.5-2.75m6-11.75.5 2.75m-6-2.75-.5 2.75m2 9.75h2.5a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-2.5a3 3 0 0 0-3 3v4.5a3 3 0 0 0 3 3Z"
      />
    </svg>
  );
}
