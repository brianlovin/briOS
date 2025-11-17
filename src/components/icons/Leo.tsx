import { IconProps } from "./types";

export function Leo({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 12C4.75 10.7574 5.75736 9.75 7 9.75C8.24264 9.75 9.25 10.7574 9.25 12C9.25 13.2426 8.24264 14.25 7 14.25C5.75736 14.25 4.75 13.2426 4.75 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 17.75L18.7409 18.4006C17.8558 19.5315 16.1442 19.5315 15.2591 18.4006C14.9308 17.981 14.765 17.457 14.7923 16.925L15.25 8C15.25 6.20507 13.7949 4.75 12 4.75C10.2051 4.75 8.75 6.20507 8.75 8C8.75 9.79493 9.21875 11.5938 9.21875 11.5938"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
