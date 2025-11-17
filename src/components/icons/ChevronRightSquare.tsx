import { IconProps } from "./types";

export function ChevronRightSquare({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m10.75 15.25 3.5-3.25-3.5-3.25m6.5-4H6.75a2 2 0 0 0-2 2v10.5a2 2 0 0 0 2 2h10.5a2 2 0 0 0 2-2V6.75a2 2 0 0 0-2-2Z"
      />
    </svg>
  );
}
