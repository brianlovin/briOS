import { IconProps } from "./types";

export function Lego({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 18.25v-3.5a1 1 0 0 1 1-1h1v-2h3.5v2h3.5v-2h3.5v2h1a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1H5.75a1 1 0 0 1-1-1Z"
      />
    </svg>
  );
}
