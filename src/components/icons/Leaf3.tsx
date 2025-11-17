import { IconProps } from "./types";

export function Leaf3({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10.75 9.75c2.123 0 2.123 2.111 2.123 2.111m0 0c6.898 0 6.368 7.389 6.368 7.389h-2.057c-3.813 0-6.203-4.097-4.311-7.389Zm0 0s.877 2.389 2.377 3.389m-6-10.5c-1.124 0-1.124 1.222-1.124 1.222m0 0c-3.652 0-3.371 4.278-3.371 4.278h1.089c2.018 0 3.284-2.372 2.282-4.278ZM15.75 4.75a3.5 3.5 0 0 1 3.5 3.5m-11 10a2.5 2.5 0 0 1-2.5-2.5"
      />
    </svg>
  );
}
