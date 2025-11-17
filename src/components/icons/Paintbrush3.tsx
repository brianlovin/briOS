import { IconProps } from "./types";

export function Paintbrush3({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.75 6.5v.75a1 1 0 0 0 1 1h8.5a1 1 0 0 0 1-1v-1.5a1 1 0 0 0-1-1h-8.5a1 1 0 0 0-1 1v.75Zm0 0h-1a1 1 0 0 0-1 1v3.25a1 1 0 0 0 1 1H10a2 2 0 0 1 2 2v2m0 0h-1a1 1 0 0 0-1 1v2.5m2-3.5h1a1 1 0 0 1 1 1v2.5"
      />
    </svg>
  );
}
