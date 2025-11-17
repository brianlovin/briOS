import { IconProps } from "./types";

export function BatteryMedium({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 8.75C4.75 7.64543 5.64543 6.75 6.75 6.75H15.25C16.3546 6.75 17.25 7.64543 17.25 8.75V15.25C17.25 16.3546 16.3546 17.25 15.25 17.25H6.75C5.64543 17.25 4.75 16.3546 4.75 15.25V8.75Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.75 9.75V14.25"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11.25 9.75V14.25"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M17.75 10.75H18C18.6904 10.75 19.25 11.3096 19.25 12V12C19.25 12.6904 18.6904 13.25 18 13.25H17.75"
      />
    </svg>
  );
}
