import { IconProps } from "./types";

export function Css({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.25 8.75h-.5a2 2 0 0 0-2 2v2.5a2 2 0 0 0 2 2h.5m5-6.5h-1.5a1 1 0 0 0-1 1v.823a1 1 0 0 0 .629.928L12.62 12a1 1 0 0 1 .629.928v1.323a1 1 0 0 1-1 1h-1.5m7.5-6.5h-1.5a1 1 0 0 0-1 1v.823a1 1 0 0 0 .629.928L17.62 12a1 1 0 0 1 .629.928v1.323a1 1 0 0 1-1 1h-1.5"
      />
    </svg>
  );
}
