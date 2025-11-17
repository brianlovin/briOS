import { IconProps } from "./types";

export function Pipe({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M15.75 5.75v-1h2.5a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1m0-4.5h-6a4 4 0 0 0-4 4v6h-1m11-10v4.5m0 0h-4.5a1 1 0 0 0-1 1v4.5m0 0h-5.5m5.5 0a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1h-4.5a1 1 0 0 1-1-1v-2.5"
      />
    </svg>
  );
}
