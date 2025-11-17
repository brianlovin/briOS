import { IconProps } from "./types";

export function EnterKey({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M17.25 6.75V12a2 2 0 0 1-2 2h-8.5m0 0 3.5-3.25M6.75 14l3.5 3.25"
      />
    </svg>
  );
}
