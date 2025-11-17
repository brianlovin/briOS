import { IconProps } from "./types";

export function ChevronUp({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M15.25 14.25L12 10.75L8.75 14.25"
      />
    </svg>
  );
}
