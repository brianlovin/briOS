import { IconProps } from "./types";

export function VideoCamera2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m15.25 10 4-1.25v6.5l-4-1.25M4.75 8.75v6.5a2 2 0 0 0 2 2h8.5V6.75h-8.5a2 2 0 0 0-2 2Z"
      />
    </svg>
  );
}
