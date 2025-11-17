import { IconProps } from "./types";

export function Password({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 7.25V6.75C19.25 5.64543 18.3546 4.75 17.25 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V11.25C4.75 12.3546 5.64543 13.25 6.75 13.25H9.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.25 13.5V11.5C17.25 10.5335 16.4665 9.75 15.5 9.75C14.5335 9.75 13.75 10.5335 13.75 11.5V13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.75 14.75C11.75 14.1977 12.1977 13.75 12.75 13.75H18.25C18.8023 13.75 19.25 14.1977 19.25 14.75V18.25C19.25 18.8023 18.8023 19.25 18.25 19.25H12.75C12.1977 19.25 11.75 18.8023 11.75 18.25V14.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
