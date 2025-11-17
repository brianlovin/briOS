import { IconProps } from "./types";

export function Scissors({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9.25 8C9.25 9.24264 8.24264 10.25 7 10.25C5.75736 10.25 4.75 9.24264 4.75 8C4.75 6.75736 5.75736 5.75 7 5.75C8.24264 5.75 9.25 6.75736 9.25 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 16C9.25 17.2426 8.24264 18.25 7 18.25C5.75736 18.25 4.75 17.2426 4.75 16C4.75 14.7574 5.75736 13.75 7 13.75C8.24264 13.75 9.25 14.7574 9.25 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 15L19.25 6.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 9L19.25 16.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
