import { IconProps } from "./types";

export function GardenHose({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14.25 5.75v-1H11A2.25 2.25 0 0 0 8.75 7m5.5-1.25v2.5m0-2.5 5 .5v1.5l-5 .5m0 0v1H11A2.25 2.25 0 0 1 8.75 7m0 0h-1a3 3 0 0 0-3 3v.25a3 3 0 0 0 3 3h8.5a3 3 0 1 1 0 6H4.75"
      />
    </svg>
  );
}
