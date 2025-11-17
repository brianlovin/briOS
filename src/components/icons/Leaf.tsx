import { IconProps } from "./types";

export function Leaf({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 13C4.75 7.4 19.25 4.75 19.25 4.75C19.25 4.75 18.25 19.25 12 19.25C8 19.25 4.75 17 4.75 13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 19.25C4.75 19.25 8 14 12.25 11.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
