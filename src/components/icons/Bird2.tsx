import { IconProps } from "./types";

export function Bird2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18.52 16.25 11.445 5.555A2.75 2.75 0 0 0 6.75 7.5v.75m11.77 8 .73 1m-.73-1h-4.27m0 0v3m0-3h-3.5m0 0v3m0-3a4 4 0 0 1-4-4v-4m0 0h-2M9.5 8h-.01"
      />
    </svg>
  );
}
