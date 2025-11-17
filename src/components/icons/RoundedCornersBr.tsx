import { IconProps } from "./types";

export function RoundedCornersBr({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9.5 5C9.5 5.27614 9.27614 5.5 9 5.5C8.72386 5.5 8.5 5.27614 8.5 5C8.5 4.72386 8.72386 4.5 9 4.5C9.27614 4.5 9.5 4.72386 9.5 5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 17C5.5 17.2761 5.27614 17.5 5 17.5C4.72386 17.5 4.5 17.2761 4.5 17C4.5 16.7239 4.72386 16.5 5 16.5C5.27614 16.5 5.5 16.7239 5.5 17Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 5C5.5 5.27614 5.27614 5.5 5 5.5C4.72386 5.5 4.5 5.27614 4.5 5C4.5 4.72386 4.72386 4.5 5 4.5C5.27614 4.5 5.5 4.72386 5.5 5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 9C5.5 9.27614 5.27614 9.5 5 9.5C4.72386 9.5 4.5 9.27614 4.5 9C4.5 8.72386 4.72386 8.5 5 8.5C5.27614 8.5 5.5 8.72386 5.5 9Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 13C5.5 13.2761 5.27614 13.5 5 13.5C4.72386 13.5 4.5 13.2761 4.5 13C4.5 12.7239 4.72386 12.5 5 12.5C5.27614 12.5 5.5 12.7239 5.5 13Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 5C17.5 5.27614 17.2761 5.5 17 5.5C16.7239 5.5 16.5 5.27614 16.5 5C16.5 4.72386 16.7239 4.5 17 4.5C17.2761 4.5 17.5 4.72386 17.5 5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 5C13.5 5.27614 13.2761 5.5 13 5.5C12.7239 5.5 12.5 5.27614 12.5 5C12.5 4.72386 12.7239 4.5 13 4.5C13.2761 4.5 13.5 4.72386 13.5 5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.75 19.25H13.25C16.5637 19.25 19.25 16.5637 19.25 13.25V10.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
