import { IconProps } from "./types";

export function CircleTwoPoints({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m11.75 11.75.5.5m-2.5-2.5.5.5m3.5 3.5.5.5m5-2.25a7.25 7.25 0 1 1-14.5 0 7.25 7.25 0 0 1 14.5 0ZM7.75 6.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm10.5 10.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
      />
    </svg>
  );
}
