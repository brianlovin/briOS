import { IconProps } from "./types";

export function VgaCable({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="#141414"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.75 7.75h-2v4.5a1 1 0 0 0 1 1h1l1.25 3h3m-4.25-8.5v-3h8.5v3m-8.5 0h8.5m0 0h2v4.5a1 1 0 0 1-1 1h-1l-1.25 3h-3m0 0v3m-2.25-8.5h4.5"
      />
    </svg>
  );
}
