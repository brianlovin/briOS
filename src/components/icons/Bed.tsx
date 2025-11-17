import { IconProps } from "./types";

export function Bed({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 18.25V12C4.75 12 7.5 10.75 12 10.75C16.5 10.75 19.25 12 19.25 12V18.25M4.75 18.25H19.25M4.75 18.25V19.25M19.25 18.25V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.75 9.25V5.75M5.75 5.75H18.25M5.75 5.75V4.75M18.25 5.75V9.25M18.25 5.75V4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
