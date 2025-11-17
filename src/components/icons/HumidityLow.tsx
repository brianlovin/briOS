import { IconProps } from "./types";

export function HumidityLow({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 17a2.25 2.25 0 0 1-4.5 0c0-1.5 2.25-5.25 2.25-5.25s2.25 3.75 2.25 5.25ZM4.75 6S8.375 8.813 12 6s7.25 0 7.25 0m-14.5 6s3.625 2.813 7.25 0"
      />
    </svg>
  );
}
