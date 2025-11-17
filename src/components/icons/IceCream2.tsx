import { IconProps } from "./types";

export function IceCream2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.85 12.25s0 0 0 0Zm0 0c-1.16 0-2.1-.96-2.1-2.143 0-1.184.94-2.143 2.1-2.143 0-1.775 1.41-3.214 3.15-3.214s3.15 1.439 3.15 3.214c1.16 0 2.1.96 2.1 2.143 0 1.183-.94 2.143-2.1 2.143h-6.3Zm.15 0s1.5 7 3 7 3-7 3-7"
      />
    </svg>
  );
}
