import { IconProps } from "./types";

export function ApplePay({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M18.25 19.25V10.75C18.25 9.64543 17.3546 8.75 16.25 8.75H7.75C6.64543 8.75 5.75 9.64543 5.75 10.75V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.75 11.25H12.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75 6.25C8.75 6.25 9.5 4.75 12 4.75C14.5 4.75 15.25 6.25 15.25 6.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
