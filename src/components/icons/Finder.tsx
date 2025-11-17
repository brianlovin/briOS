import { IconProps } from "./types";

export function Finder({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.25 4.75h-1.5a3 3 0 0 0-3 3v8.5a3 3 0 0 0 3 3h8.5a3 3 0 0 0 3-3v-8.5a3 3 0 0 0-3-3h-1.963a2 2 0 0 0-1.933 1.485l-1.269 4.757a1 1 0 0 0 .967 1.258h1.198m2-3.5v1.5m-6.5-1.5v1.5m0 4.75s.75 1.25 3.25 1.25S15.25 15 15.25 15"
      />
    </svg>
  );
}
