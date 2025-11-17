import { IconProps } from "./types";

export function Ethereum({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M5.75 10L12 4.75L18.25 10M5.75 10L12 19.25L18.25 10M5.75 10L12 12.25L18.25 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
