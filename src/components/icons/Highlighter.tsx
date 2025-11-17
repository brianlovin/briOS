import { IconProps } from "./types";

export function Highlighter({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M11.25 17.25L19.25 7.75L16.25 4.75L6.75 12.75M11.25 17.25L4.75 19.25M11.25 17.25L6.75 12.75M4.75 19.25L6.75 12.75M4.75 19.25H19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
