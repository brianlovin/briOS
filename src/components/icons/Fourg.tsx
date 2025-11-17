import { IconProps } from "./types";

export function Fourg({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.25 15.25V13m0 0V8.75L5.75 13h3.5Zm0 0h1m6-4.25h-.5a3 3 0 0 0-3 3v.5a3 3 0 0 0 3 3h.5a1 1 0 0 0 1-1v-2H16"
      />
    </svg>
  );
}
