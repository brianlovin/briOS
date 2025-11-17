import { IconProps } from "./types";

export function Toothbrush({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m19.25 19.25-7-7.214h-3l-1.46-1.427m0 0L4.75 7.613 6.3 6.045a.979.979 0 0 1 1.4 0l1.573 1.592c.4.404.4 1.066 0 1.47L7.79 10.61Z"
      />
    </svg>
  );
}
