import { IconProps } from "./types";

export function Magnet({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 5.75C4.75 5.19771 5.19772 4.75 5.75 4.75H8.25C8.80228 4.75 9.25 5.19772 9.25 5.75V12.25C9.25 13.7688 10.4812 15 12 15C13.5188 15 14.75 13.7688 14.75 12.25V5.75C14.75 5.19772 15.1977 4.75 15.75 4.75H18.25C18.8023 4.75 19.25 5.19772 19.25 5.75V12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12V5.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 8.75H9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 8.75H19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
