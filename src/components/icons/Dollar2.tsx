import { IconProps } from "./types";

export function Dollar2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M17.25 6.75H9.375C7.92525 6.75 6.75 7.92525 6.75 9.375C6.75 10.8247 7.92525 12 9.375 12H14.625C16.0747 12 17.25 13.1753 17.25 14.625C17.25 16.0747 16.0747 17.25 14.625 17.25H6.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.75 19.25V4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
