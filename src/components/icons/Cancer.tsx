import { IconProps } from "./types";

export function Cancer({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 17.75C4.75 17.75 7 19.25 12 19.25C14.1719 19.25 15.8906 18.8047 17.6016 18.1719"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 6.25C19.25 6.25 17 4.75 12 4.75C9.82811 4.75 8.10938 5.19531 6.39844 5.82812"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 16C19.25 17.2426 18.2426 18.25 17 18.25C15.7574 18.25 14.75 17.2426 14.75 16C14.75 14.7574 15.7574 13.75 17 13.75C18.2426 13.75 19.25 14.7574 19.25 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 8C4.75 6.75736 5.75736 5.75 7 5.75C8.24264 5.75 9.25 6.75736 9.25 8C9.25 9.24264 8.24264 10.25 7 10.25C5.75736 10.25 4.75 9.24264 4.75 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
