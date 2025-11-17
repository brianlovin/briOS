import { IconProps } from "./types";

export function Shouting({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.25 19.25v-2h2a1 1 0 0 0 1-1V13h1a1 1 0 0 0 1-1v-1A6.25 6.25 0 0 0 7 4.75H4.75M9 10h.01m7.74 2.25 2.5-.5m-2.5 4 2.5.5"
      />
    </svg>
  );
}
