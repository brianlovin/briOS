import { IconProps } from "./types";

export function BatteryCharging({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.25 6.75H6.75C5.64543 6.75 4.75 7.64543 4.75 8.75V15.25C4.75 16.3546 5.64543 17.25 6.75 17.25H7.25M14.75 6.75H15.25C16.3546 6.75 17.25 7.64543 17.25 8.75V15.25C17.25 16.3546 16.3546 17.25 15.25 17.25H13.75"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M17.75 10.75H18C18.6904 10.75 19.25 11.3096 19.25 12V12C19.25 12.6904 18.6904 13.25 18 13.25H17.75"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11.75 6.75L8.75 12H13.25L10.25 17.25"
      />
    </svg>
  );
}
