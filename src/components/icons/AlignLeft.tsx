import { IconProps } from "./types";

export function AlignLeft({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M8.75 13.2502L8.75 10.75C8.75 9.64543 9.64543 8.75 10.75 8.75L17.25 8.75C18.3546 8.75 19.25 9.64543 19.25 10.75V13.2502C19.25 14.3548 18.3546 15.2502 17.25 15.2502L10.75 15.2502C9.64543 15.2502 8.75 14.3548 8.75 13.2502Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 4.75V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
