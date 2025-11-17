import { IconProps } from "./types";

export function DirectorChair({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 12.25h-1m1 0h12.5m-12.5 0v-6.5m0 6.5 6.25 3.5m7.25-3.5h-1m0 0v-6.5m0 6.5L12 15.75m-6.25-10v-1m0 1s2.25-1 6.25-1 6.25 1 6.25 1m0 0v-1m-6.25 11-6.25 3.5m6.25-3.5 6.25 3.5"
      />
    </svg>
  );
}
