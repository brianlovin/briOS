import { IconProps } from "./types";

export function HalfCircleBottom({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 11.75C4.75 16 7.99594 19.25 12 19.25C16.0041 19.25 19.25 16 19.25 11.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
