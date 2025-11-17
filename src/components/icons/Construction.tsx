import { IconProps } from "./types";

export function Construction({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 5.75H4.75v4.5m14.5-4.5v4.5h-3m3-4.5-2.5 4.5m-12 0h3m-3 0 2.5-4.5m.5 4.5v8m0-8h8.5m-8.5 0 2.5-4.5m6 4.5v8m-3-12.5-2.5 4.5m5.5-4.5-2.5 4.5"
      />
    </svg>
  );
}
