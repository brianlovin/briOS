import { IconProps } from "./types";

export function Sewer({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 4.75H11.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 9.25H11.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.25 7C13.25 8.24264 12.4665 9.25 11.5 9.25C10.5335 9.25 9.75 8.24264 9.75 7C9.75 5.75736 10.5335 4.75 11.5 4.75C12.4665 4.75 13.25 5.75736 13.25 7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 15.25C4.75 15.25 7 15.5 7 12.75C7 15.5 9.58333 15.25 9.58333 15.25C9.58333 15.25 12 15.5 12 12.75C12 15.5 14.4167 15.25 14.4167 15.25C14.4167 15.25 17 15.5 17 12.75C17 15.5 19.25 15.25 19.25 15.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 19.25H19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
