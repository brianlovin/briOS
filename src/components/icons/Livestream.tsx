import { IconProps } from "./types";

export function Livestream({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M15.75 5.75C17.7086 7.04802 19.25 9.47441 19.25 12C19.25 14.5257 17.7086 16.952 15.75 18.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.25 5.75C6.29145 7.04802 4.75 9.47441 4.75 12C4.75 14.5257 6.29145 16.952 8.25 18.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.75 8.75C15.5222 9.51951 16.25 10.8238 16.25 12C16.25 13.1763 15.5222 14.4805 14.75 15.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 8.75C8.47784 9.51951 7.75 10.8238 7.75 12C7.75 13.1763 8.47784 14.4805 9.25 15.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 12C12.5 12.2761 12.2761 12.5 12 12.5C11.7239 12.5 11.5 12.2761 11.5 12C11.5 11.7239 11.7239 11.5 12 11.5C12.2761 11.5 12.5 11.7239 12.5 12Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
