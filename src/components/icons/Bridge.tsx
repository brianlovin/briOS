import { IconProps } from "./types";

export function Bridge({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.75 4.75v14.5m0-14.5c0 2.485 2.35 4.5 5.25 4.5s5.25-2.015 5.25-4.5m-10.5 0c0 2.5-2.003 2.5-2.003 2.5m12.503-2.5v14.5m0-14.5c0 2.5 2 2.5 2 2.5m-14.5 8.5h14.5"
      />
    </svg>
  );
}
