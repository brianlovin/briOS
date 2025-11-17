import { IconProps } from "./types";

export function MagicHat({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M18.173 15.0393C18.8899 14.8568 19.5211 15.3374 19.1407 15.9201C18.2616 17.2668 15.9465 19.25 12.0001 19.25C8.05361 19.25 5.74638 17.2668 4.86733 15.9201C4.48695 15.3374 5.11808 14.8568 5.83499 15.0393C7.10842 15.3635 9.39026 15.7376 12.0001 15.7376C14.6098 15.7376 16.8996 15.3635 18.173 15.0393Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 15V8.75C6.75 7.64543 7.64543 6.75 8.75 6.75H11.25M17.25 12.75V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 4.75C17 5.89705 15.8971 7 14.75 7C15.8971 7 17 8.10295 17 9.25C17 8.10295 18.1029 7 19.25 7C18.1029 7 17 5.89705 17 4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
