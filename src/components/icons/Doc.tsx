import { IconProps } from "./types";

export function Doc({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M6.25 8.75H4.75V15.25H6.25C7.35457 15.25 8.25 14.3546 8.25 13.25V10.75C8.25 9.64543 7.35457 8.75 6.25 8.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.25 13.5V10.5C14.25 9.5335 13.4665 8.75 12.5 8.75C11.5335 8.75 10.75 9.5335 10.75 10.5V13.5C10.75 14.4665 11.5335 15.25 12.5 15.25C13.4665 15.25 14.25 14.4665 14.25 13.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 8.75H18.75C17.6454 8.75 16.75 9.64543 16.75 10.75V13.25C16.75 14.3546 17.6454 15.25 18.75 15.25H19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
