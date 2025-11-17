import { IconProps } from "./types";

export function Pot2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 13V9.75h12.5V13m-12.5 0v4.25a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2V13m-12.5 0-1-1.25M18.25 13l1-1.25m-10.5-7v1.5m6.5-1.5v1.5m-3.25 0v-1.5"
      />
    </svg>
  );
}
