import { IconProps } from "./types";

export function Stop({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <rect
        width="12.5"
        height="12.5"
        x="5.75"
        y="5.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        rx="1"
      />
    </svg>
  );
}
