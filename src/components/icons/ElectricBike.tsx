import { IconProps } from "./types";

export function ElectricBike({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13.75 9.75h2l.5 5-1 .5H10m-1.5 0H10m0 0-1.25-2.5h1.5M6 4.75l-1.25 2.5h2.5l-1.25 3M9.25 17a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm10 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
      />
    </svg>
  );
}
