import { IconProps } from "./types";

export function LaptopError({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 14.75h-1v1.5a2 2 0 0 0 2 2h10.5a2 2 0 0 0 2-2v-1.5h-1m-12.5 0v-8a1 1 0 0 1 1-1h8.5m-9.5 9H10s.344 1 2 1c1.656 0 2-1 2-1h4.25m0 0v-2m1-8v1.5m0 3V9"
      />
    </svg>
  );
}
