import { IconProps } from "./types";

export function BringForward({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="#141414"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 9.75v.5m0 3.5v.5m0 3.5v.5a1 1 0 0 0 1 1h.5m3.5 0h.5m3.5 0h.5m-3.5-4h6.5a2 2 0 0 0 2-2v-6.5a2 2 0 0 0-2-2h-6.5a2 2 0 0 0-2 2v6.5a2 2 0 0 0 2 2Z"
      />
    </svg>
  );
}
