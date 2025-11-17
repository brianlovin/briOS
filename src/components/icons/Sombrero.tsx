import { IconProps } from "./types";

export function Sombrero({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 14.75H19.25L18.598 17.6839C18.3947 18.5989 17.5831 19.25 16.6457 19.25H7.35434C6.41695 19.25 5.60532 18.5989 5.40197 17.6839L4.75 14.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 14.25L8.63548 6.28907C8.84913 5.38701 9.65464 4.75 10.5816 4.75H13.4184C14.3454 4.75 15.1509 5.38701 15.3645 6.28907L17.25 14.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 11.75H16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 18.75L8 16.75L10 18.75L12 16.75L14 18.75L16 16.75L18 18.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
