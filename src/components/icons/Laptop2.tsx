import { IconProps } from "./types";

export function Laptop2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 14.75h-1v1.5a2 2 0 0 0 2 2h10.5a2 2 0 0 0 2-2v-1.5H14s-.344 1-2 1c-1.656 0-2-1-2-1H5.75Zm0 0v-8a1 1 0 0 1 1-1h10.5a1 1 0 0 1 1 1v8"
      />
    </svg>
  );
}
