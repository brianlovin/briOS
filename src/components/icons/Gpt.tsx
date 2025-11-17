import { IconProps } from "./types";

export function Gpt({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.25 9.75h-1.5a1 1 0 0 0-1 1v3.5a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1v-1.5H7.083m4.167 2.5v-3m0 0v-2.5h2.5v2.5h-2.5Zm5.5-2.5H18m0 0h1.25m-1.25 0v5.5"
      />
    </svg>
  );
}
