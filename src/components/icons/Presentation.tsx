import { IconProps } from "./types";

export function Presentation({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 4.75h12.5m-12.5 0v8.5a2 2 0 0 0 2 2H10M5.75 4.75h-1m13.5 0v8.5a2 2 0 0 1-2 2H14m4.25-10.5h1M10 15.25l-1.25 4m1.25-4h4m0 0 1.25 4"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.75 12.25 11 9.75l2 2.5 2.25-4.5"
      />
    </svg>
  );
}
