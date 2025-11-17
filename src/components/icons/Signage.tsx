import { IconProps } from "./types";

export function Signage({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8 9.75H6.75a2 2 0 0 0-2 2v5.5a2 2 0 0 0 2 2h10.5a2 2 0 0 0 2-2v-5.5a2 2 0 0 0-2-2H16m-8 0 4-5 4 5m-8 0h8"
      />
    </svg>
  );
}
