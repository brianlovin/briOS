import { IconProps } from "./types";

export function Borders({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M16.25 19.25H7.75M19.25 7.75V16.25M4.75 7.75L4.75 16.25M16.25 4.75L7.75 4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
