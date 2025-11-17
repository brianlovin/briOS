import { IconProps } from "./types";

export function LaptopCheck({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="#141414"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 14.75h-1v1.5a2 2 0 0 0 2 2h10.5a2 2 0 0 0 2-2v-1.5h-1m-12.5 0v-8a1 1 0 0 1 1-1h4.5m-5.5 9H10s.344 1 2 1c1.656 0 2-1 2-1h4.25m0 0v-3m-3.5-5 1.5 1.5c.75-2.25 3-3.5 3-3.5"
      />
    </svg>
  );
}
