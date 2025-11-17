import { IconProps } from "./types";

export function BellOff({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M17.25 6.875V12L19.25 16.25H7.75M5.75 14.125L6.75 12V10C6.75 7.10051 9.10051 4.75 12 4.75C12 4.75 13.6094 4.75002 14.5938 5.24998"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9 16.75C9 16.75 9 19.25 12 19.25C15 19.25 15 16.75 15 16.75"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 4.75L4.75 19.25"
      />
    </svg>
  );
}
