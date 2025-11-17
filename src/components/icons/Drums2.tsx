import { IconProps } from "./types";

export function Drums2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 12c0 1.243 2.798 2.25 6.25 2.25s6.25-1.007 6.25-2.25m-12.5 0c0-1.243 2.798-2.25 6.25-2.25s6.25 1.007 6.25 2.25m-12.5 0v5c0 1.243 2.798 2.25 6.25 2.25s6.25-1.007 6.25-2.25v-5M4.75 4.75l5.5 6.5m9-6.5-5.5 6.5"
      />
    </svg>
  );
}
