import { IconProps } from "./types";

export function Baht({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.75 12v5.25h3m-3-5.25h4m-4 0V6.75h3m1 5.25c1.45 0 2.5 1.175 2.5 2.625s-1.05 2.625-2.5 2.625h-1m1-5.25c1.45 0 2.5-1.175 2.5-2.625S14.2 6.75 12.75 6.75h-1m0 0v-2m0 2v10.5m0 0v2"
      />
    </svg>
  );
}
