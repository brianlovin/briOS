import { IconProps } from "./types";

export function AltKey({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11.75 8.75v5.5a1 1 0 0 0 1 1h1.5m1.5-6.5h2m0 0h1.5m-1.5 0v6.5m-9.192-2L7 8.75l-1.558 4.5m3.116 0 .692 2m-.692-2H5.442m-.692 2 .692-2"
      />
    </svg>
  );
}
