import { IconProps } from "./types";

export function Smoking({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 14.75v3.5m-11-3.5h-2.5a1 1 0 0 0-1 1v1.5a1 1 0 0 0 1 1h2.5m0-3.5h8v3.5h-8m0-3.5v3.5m11-7v-.5a2 2 0 0 0-2-2h-3.5a2 2 0 0 1-2-2v-1"
      />
    </svg>
  );
}
