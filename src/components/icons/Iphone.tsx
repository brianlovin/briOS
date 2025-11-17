import { IconProps } from "./types";

export function Iphone({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M15.2502 19.25H8.75C7.64543 19.25 6.75 18.3546 6.75 17.25V6.75C6.75 5.64543 7.64543 4.75 8.75 4.75H15.2502C16.3548 4.75 17.2502 5.64543 17.2502 6.75V17.25C17.2502 18.3546 16.3548 19.25 15.2502 19.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.75 16.75H12.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
