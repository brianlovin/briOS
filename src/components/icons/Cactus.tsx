import { IconProps } from "./types";

export function Cactus({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.75 19.25h2m0 0h6.5m-6.5 0v-6m6.5 6h2m-2 0v-4m0 0V8a3.25 3.25 0 0 0-6.5 0v5.25m6.5 2a3 3 0 0 0 3-3V8m-9.5 5.25a3 3 0 0 1-3-3V10"
      />
    </svg>
  );
}
