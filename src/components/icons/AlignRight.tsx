import { IconProps } from "./types";

export function AlignRight({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 13.2502L4.75 10.75C4.75 9.64543 5.64543 8.75 6.75 8.75L13.25 8.75C14.3546 8.75 15.25 9.64543 15.25 10.75V13.2502C15.25 14.3548 14.3546 15.2502 13.25 15.2502L6.75 15.2502C5.64543 15.2502 4.75 14.3548 4.75 13.2502Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 4.75V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
