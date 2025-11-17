import { IconProps } from "./types";

export function BallRollingFast({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m10.25 9.25-3.5-2.5m9.5 2.5-3.5-2.5m-8 2 14.5 10.5H6.75a2 2 0 0 1-2-2v-8.5ZM17 16.25a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5Z"
      />
    </svg>
  );
}
