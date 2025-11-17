import { IconProps } from "./types";

export function ChartDecrease({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 4.75V19.25H19.25M7.75 4.75C14.1389 4.75 16 9.3125 16 12.5V15.25M16 15.25L13.75 12.75M16 15.25L18.25 12.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
