import { IconProps } from "./types";

export function NoParking({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.2502 19.25V6.75C19.2502 5.64543 18.3548 4.75 17.2502 4.75H4.75M4.75 8.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H15.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 4.75L19.25 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 15.25V13.75M9.75 8.75H12.5C13.4665 8.75 14.25 9.5335 14.25 10.5V10.5C14.25 11.4665 13.4665 12.25 12.5 12.25V12.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
