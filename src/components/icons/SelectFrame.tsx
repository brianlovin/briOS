import { IconProps } from "./types";

export function SelectFrame({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.5 18.25h4.75m6-7V7.5M16.5 5.75h-9M5.75 7.5v9m11.813.44 1.687-1.19-4.5-3 1 5.5 1.813-1.31Zm0 0 1.843 2.31M4.75 4.75h2.5v2.5h-2.5v-2.5Zm0 12h2.5v2.5h-2.5v-2.5Zm12-12h2.5v2.5h-2.5v-2.5Z"
      />
    </svg>
  );
}
