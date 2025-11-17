import { IconProps } from "./types";

export function SpeedFast({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.029 18.5a6.25 6.25 0 1 0 0-11M4.75 10h3.5m-3.5 6h3.5m-3.5-3h1.5M16.5 8.5l.75-.75M12 6.5V4.75m0 0H9.75m2.25 0h2.25m0 6-2.5 2.5"
      />
    </svg>
  );
}
