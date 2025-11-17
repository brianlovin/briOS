import { IconProps } from "./types";

export function Jpg({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M8.25 8.75V13.5C8.25 14.4665 7.4665 15.25 6.5 15.25C5.5335 15.25 4.75 14.4665 4.75 13.5V12.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.75 15.25V12.25M10.75 12.25V8.75H12.25C12.8023 8.75 13.25 9.19772 13.25 9.75V11.25C13.25 11.8023 12.8023 12.25 12.25 12.25H10.75Z"
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
