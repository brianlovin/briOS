import { IconProps } from "./types";

export function Png({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 15.25V12.25M4.75 12.25V8.75H6.25C6.80228 8.75 7.25 9.19772 7.25 9.75V11.25C7.25 11.8023 6.80228 12.25 6.25 12.25H4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 15.25V8.75L13.25 15.25V8.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 8.75H17.75C16.6454 8.75 15.75 9.64543 15.75 10.75V13.25C15.75 14.3546 16.6454 15.25 17.75 15.25H19.25V12.25H17.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
