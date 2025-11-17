import { IconProps } from "./types";

export function AlignVerticalCenter({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 4.75H19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 19.25H19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 13.2502L6.75 10.75C6.75 9.64543 7.64543 8.75 8.75 8.75L15.25 8.75C16.3546 8.75 17.25 9.64543 17.25 10.75V13.2502C17.25 14.3548 16.3546 15.2502 15.25 15.2502L8.75 15.2502C7.64543 15.2502 6.75 14.3548 6.75 13.2502Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
