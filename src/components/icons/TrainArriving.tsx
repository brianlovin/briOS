import { IconProps } from "./types";

export function TrainArriving({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 6.75h2.4c2.275 0 4.44 1.031 5.952 2.834l2.641 3.152c1.141 1.362.23 3.514-1.487 3.514H4.75m9.25-5H9.75a2 2 0 0 1-2-2V7m11.5 12.25H4.75M14.75 6h4.5m0 0-1.5-1.25M19.25 6l-1.5 1.25"
      />
    </svg>
  );
}
