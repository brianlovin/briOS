import { IconProps } from "./types";

export function Minimize({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.25 19.25V16.75C9.25 15.6454 8.35457 14.75 7.25 14.75H4.75"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14.75 19.25V16.75C14.75 15.6454 15.6454 14.75 16.75 14.75H19.25"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14.75 4.75V7.25C14.75 8.35457 15.6454 9.25 16.75 9.25H19.25"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.25 4.75V7.25C9.25 8.35457 8.35457 9.25 7.25 9.25H4.75"
      />
    </svg>
  );
}
