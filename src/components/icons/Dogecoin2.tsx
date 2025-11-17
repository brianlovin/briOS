import { IconProps } from "./types";

export function Dogecoin2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M8.75 5.75H11C14.4518 5.75 17.25 8.54822 17.25 12C17.25 15.4518 14.4518 18.25 11 18.25H8.75M8.75 5.75V18.25M8.75 5.75H6.75M8.75 18.25H6.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 12H12.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
