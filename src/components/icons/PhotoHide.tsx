import { IconProps } from "./types";

export function PhotoHide({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 4.75H17.25C18.3546 4.75 19.25 5.64543 19.25 6.75V12.25M19.25 12.25L16.5856 9.43947C15.7663 8.48581 14.2815 8.51598 13.5013 9.50017L13.4917 9.51251C13.4243 9.59962 12.612 10.6503 11.7732 11.7262M19.25 12.25V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 16L7.25 12.75M4.75 16V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H14.25M4.75 16V9"
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
    </svg>
  );
}
