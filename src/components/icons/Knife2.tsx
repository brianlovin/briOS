import { IconProps } from "./types";

export function Knife2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m11.447 13.75 5.457 5.126a1.45 1.45 0 0 0 1.943 0 1.214 1.214 0 0 0 0-1.806L5.796 4.75l-.248.374c-1.15 1.738-1.05 3.951.256 5.592l.8 1.006c1.015 1.276 2.62 2.028 4.328 2.028h.515Z"
      />
    </svg>
  );
}
