import { IconProps } from "./types";

export function ChartIncrease({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.75 16.25C14.1389 16.25 16 11.6875 16 8.5V5.75M16 5.75L13.75 8.25M16 5.75L18.25 8.25M4.75 4.75V19.25H19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
