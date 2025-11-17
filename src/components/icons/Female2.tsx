import { IconProps } from "./types";

export function Female2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.75 19.25s2.125-.75 2.5-3.5c-2.083 0-3.5-1.186-3.5-1.186s1.083-1.971 1.083-4.338C6.833 7.76 8.5 4.75 12 4.75s5.167 3.01 5.167 5.476c0 2.367 1.083 4.338 1.083 4.338s-1.417 1.186-3.5 1.186c.375 2.75 2.5 3.5 2.5 3.5"
      />
    </svg>
  );
}
