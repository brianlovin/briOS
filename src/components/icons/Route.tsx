import { IconProps } from "./types";

export function Route({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M17.2502 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H17.2502C18.3548 4.75 19.2502 5.64543 19.2502 6.75V17.25C19.2502 18.3546 18.3548 19.25 17.2502 19.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 8.25H12C13.2426 8.25 14.25 9.25736 14.25 10.5C14.25 11.7426 13.2426 12.75 12 12.75H9.25C8.42157 12.75 7.75 13.4216 7.75 14.25C7.75 15.0784 8.42157 15.75 9.25 15.75H13.25C14.3546 15.75 15.25 16.6454 15.25 17.75V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.75 8.25H8.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
