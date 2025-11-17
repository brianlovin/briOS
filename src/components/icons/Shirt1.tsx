import { IconProps } from "./types";

export function Shirt1({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m9 5.25-4.25 4.5L6 12.25h1.75v6s1.25 1 4.25 1 4.25-1 4.25-1v-6H18l1.25-2.5L15 5.25m-6 0s3 1.25 3 5c0-3.75 3-5 3-5m-6 0s1.5-.465 3-.465 3 .465 3 .465"
      />
    </svg>
  );
}
