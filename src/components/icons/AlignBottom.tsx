import { IconProps } from "./types";

export function AlignBottom({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M13.2502 15.25H10.75C9.64543 15.25 8.75 14.3546 8.75 13.25V6.75C8.75 5.64543 9.64543 4.75 10.75 4.75H13.2502C14.3548 4.75 15.2502 5.64543 15.2502 6.75V13.25C15.2502 14.3546 14.3548 15.25 13.2502 15.25Z"
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
    </svg>
  );
}
