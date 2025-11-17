import { IconProps } from "./types";

export function Calculator2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 14.75 7.5 16.5m0 0 1.75 1.75M7.5 16.5l1.75-1.75M7.5 16.5l-1.75 1.75M10.25 8h-4.5m12.5-.25h-3.5m3.5 7h-3.5m3.5 3.5h-3.5m-6.75-8v-4.5"
      />
    </svg>
  );
}
