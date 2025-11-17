import { IconProps } from "./types";

export function HomeWifi({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 8.63v9.62a1 1 0 0 0 1 1h10.5a1 1 0 0 0 1-1V8.63m-12.5 0-1 .62m1-.62L12 4.75l6.25 3.88m0 0 1 .62m-10.5 4.97c1.795-1.96 4.705-1.96 6.5 0m-4.643 2.03c.77-.84 2.017-.84 2.786 0"
      />
    </svg>
  );
}
