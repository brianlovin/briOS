import { IconProps } from "./types";

export function TrainDeparting({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 6.75h-2.4c-2.275 0-4.44 1.031-5.952 2.834l-2.641 3.152c-1.141 1.362-.23 3.514 1.487 3.514h9.506m-9.25-5h4.25a2 2 0 0 0 2-2V7m3 12.25H4.75M9.25 6h-4.5m0 0 1.5-1.25M4.75 6l1.5 1.25"
      />
    </svg>
  );
}
