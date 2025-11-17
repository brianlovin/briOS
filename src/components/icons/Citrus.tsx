import { IconProps } from "./types";

export function Citrus({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m17.302 14.814 1.948 1.948A8.494 8.494 0 1 1 7.238 4.75l1.948 1.948m8.116 8.116-4.058-4.058m4.058 4.058a5.721 5.721 0 0 1-4.058 1.681m-4.058-1.68 4.058-4.059m-4.058 4.058a5.721 5.721 0 0 1-1.681-4.058m1.68 4.058a5.721 5.721 0 0 0 4.059 1.681M9.186 6.698l4.058 4.058M9.186 6.698a5.721 5.721 0 0 0-1.681 4.058m5.739 0h-5.74m5.74 0v5.74"
      />
    </svg>
  );
}
