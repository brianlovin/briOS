import { IconProps } from "./types";

export function Stairs2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 19.25V4.75H8.75a4 4 0 0 0-4 4v10.5m14.5 0H4.75m14.5 0v-3.5m-14.5 3.5v-3.5h14.5m0 0H7.75v-3.5h11.5-8.5v-3.5h8.5"
      />
    </svg>
  );
}
