import { IconProps } from "./types";

export function Trees({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9.25 13C9.25 14.2426 8.24264 15.25 7 15.25C5.75736 15.25 4.75 14.2426 4.75 13C4.75 11.7574 5.75736 10.75 7 10.75C8.24264 10.75 9.25 11.7574 9.25 13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 9C19.25 11.3472 17.3472 13.25 15 13.25C12.6528 13.25 10.75 11.3472 10.75 9C10.75 6.65279 12.6528 4.75 15 4.75C17.3472 4.75 19.25 6.65279 19.25 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 13.75V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 9.75V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 19.25H4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
