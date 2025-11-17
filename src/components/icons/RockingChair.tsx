import { IconProps } from "./types";

export function RockingChair({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m6.75 4.75.492 4 .399 2.783a2 2 0 0 0 1.98 1.717H11m5.25 0H13m-2 0L9 18m2-4.75h3.25H13m0 0L15 18m-8.484-2A6.249 6.249 0 0 0 12 19.25 6.249 6.249 0 0 0 17.484 16"
      />
    </svg>
  );
}
