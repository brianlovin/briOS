import { IconProps } from "./types";

export function CursorText({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M17 18.25V5.75M17 18.25C17 19.25 14.75 19.25 14.75 19.25M17 18.25C17 19.25 19.25 19.25 19.25 19.25M17 5.75C17 4.75 14.75 4.75 14.75 4.75M17 5.75C17 4.75 19.25 4.75 19.25 4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 12.25H18.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 16.25L8 7.75L11.25 16.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 13.25H10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
