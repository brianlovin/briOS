import { IconProps } from "./types";

export function Fiveg({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10.25 8.75h-3.5v2.5h1.5a2 2 0 1 1 0 4h-1.5m9.5-6.5h-.5a3 3 0 0 0-3 3v.5a3 3 0 0 0 3 3h.5a1 1 0 0 0 1-1v-2H16"
      />
    </svg>
  );
}
