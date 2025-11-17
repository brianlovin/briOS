import { IconProps } from "./types";

export function Fahrenheit({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 6.5C19.25 7.4665 18.4665 8.25 17.5 8.25C16.5335 8.25 15.75 7.4665 15.75 6.5C15.75 5.5335 16.5335 4.75 17.5 4.75C18.4665 4.75 19.25 5.5335 19.25 6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 19.25V7.75C4.75 6.09315 6.09315 4.75 7.75 4.75H12.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 11.75H10.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
