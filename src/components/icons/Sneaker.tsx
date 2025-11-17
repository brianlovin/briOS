import { IconProps } from "./types";

export function Sneaker({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 14.25v-.327a3 3 0 0 0-1.747-2.726L12.72 9m6.529 5.25H4.75m14.5 0v2.5H4.75v-2.5m0 0V9c3 1 5.25-1.25 5.25-1.25L12.72 9m0 0-1.97 2.25"
      />
    </svg>
  );
}
