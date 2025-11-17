import { IconProps } from "./types";

export function TemperatureLow({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9 15.25v-1.5m5.75-5 2.25 2.5m0 0 2.25-2.5M17 11.25v-6.5M6.75 7v4.394a4.25 4.25 0 1 0 4.5 0V7a2.25 2.25 0 0 0-4.5 0Z"
      />
    </svg>
  );
}
