import { IconProps } from "./types";

export function Sweep({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m8 16.325 6.173 2.925 1.431-2.965a3.207 3.207 0 0 0-1.989-4.473M8 16.325 4.75 15c1.982 0 3.069-1.29 3.91-2.502.779-1.125 2.116-1.515 3.43-1.132l1.525.447M8 16.325c.72.341 2.5-.325 3.25-1.575m2.365-2.938L18.25 4.75"
      />
    </svg>
  );
}
