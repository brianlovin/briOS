import { IconProps } from "./types";

export function Files({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.75 6.75h-3a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h6.5a2 2 0 0 0 2-2v-5m-5.5-5.5 5.5 5.5m-5.5-5.5v3.5a2 2 0 0 0 2 2h3.5m-3.5-7.5h2l5.5 5.5v5a2 2 0 0 1-2 2H15.5"
      />
    </svg>
  );
}
