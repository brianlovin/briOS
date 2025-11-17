import { IconProps } from "./types";

export function Temperature({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M10.75 4.75C9.64543 4.75 8.75 5.64543 8.75 6.75V11.3938C7.54892 12.1447 6.75 13.4791 6.75 15C6.75 17.3472 8.65279 19.25 11 19.25C13.3472 19.25 15.25 17.3472 15.25 15C15.25 13.4791 14.4511 12.1447 13.25 11.3938V6.75C13.25 5.64543 12.3546 4.75 11.25 4.75H10.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.25 4.75H16.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.25 7.75H16.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.25 10.75H16.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 15.25V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
