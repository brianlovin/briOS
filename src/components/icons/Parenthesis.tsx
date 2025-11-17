import { IconProps } from "./types";

export function Parenthesis({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M8.25 4.75C8.25 4.75 4.75 7.06294 4.75 12C4.75 16.9371 8.25 19.25 8.25 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 4.75C15.75 4.75 19.25 7.06294 19.25 12C19.25 16.9371 15.75 19.25 15.75 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
