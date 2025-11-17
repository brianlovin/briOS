import { IconProps } from "./types";

export function QrScan({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 7.25v-2.5h14.5v2.5m-14.5 9.5v2.5h14.5v-2.5M4.75 12h14.5"
      />
    </svg>
  );
}
