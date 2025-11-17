import { IconProps } from "./types";

export function Building2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16.25 10V7.75l-2.5-3h-6.5l-2.5 3v11.5H15M7.75 8.75v1.5m0 3.5v1.5m3-6.5v1.5m2 2.667L16 9.75l3.25 3.167v6.333h-6.5v-6.333Z"
      />
    </svg>
  );
}
