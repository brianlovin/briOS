import { IconProps } from "./types";

export function Gavel({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M10 14.25L5.75 10L7 8.75L7.5 9.25L10 6.75L9.5 6.25L11 4.75L15.25 9L14 10.25L13.5 9.75L10.75 12.5L11.25 13L10 14.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12L19.25 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 18.75V19.25H13.25V18.75C13.25 17.6454 12.3546 16.75 11.25 16.75H6.75C5.64543 16.75 4.75 17.6454 4.75 18.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 8L12 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
