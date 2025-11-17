import { IconProps } from "./types";

export function MagnetBolt({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 8.75V6.75C19.25 5.64543 18.3546 4.75 17.25 4.75H16.75C15.6454 4.75 14.75 5.64543 14.75 6.75V12.25C14.75 13.7688 13.5188 15 12 15C10.4812 15 9.25 13.7688 9.25 12.25V6.75C9.25 5.64543 8.35457 4.75 7.25 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V12C4.75 16.0041 7.99594 19.25 12 19.25H13.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 8.75H9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 8.75H19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.25 12.75L15.75 16.25H19.25L16.75 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
