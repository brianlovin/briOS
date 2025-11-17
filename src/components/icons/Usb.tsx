import { IconProps } from "./types";

export function Usb({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.75 8.75H16.25V17.25C16.25 18.3546 15.3546 19.25 14.25 19.25H9.75C8.64543 19.25 7.75 18.3546 7.75 17.25V8.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.25 8.5V4.75H9.75V8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
