import { IconProps } from "./types";

export function Male({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M13.75 4.75H19.25M19.25 4.75V10.25M19.25 4.75L12 12M13.25 15C13.25 17.3472 11.3472 19.25 9 19.25C6.65279 19.25 4.75 17.3472 4.75 15C4.75 12.6528 6.65279 10.75 9 10.75C11.3472 10.75 13.25 12.6528 13.25 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
