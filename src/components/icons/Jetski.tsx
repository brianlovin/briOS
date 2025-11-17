import { IconProps } from "./types";

export function Jetski({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m4.75 13.25.246-.614A3 3 0 0 1 7.78 10.75H13m6.25 0-1 2.5m1-2.5s-1-4-6.25-4m6.25 4H13m0-4-1.25-1m1.25 1v4m-8.25 6c0 .828.811 1.5 1.813 1.5 1 0 1.812-.672 1.812-1.5 0 .828.811 1.5 1.813 1.5 1 0 1.812-.672 1.812-1.5 0 .828.812 1.5 1.813 1.5 1 0 1.812-.672 1.812-1.5 0 .828.811 1.5 1.813 1.5 1 0 1.812-.672 1.812-1.5"
      />
    </svg>
  );
}
