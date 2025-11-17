import { IconProps } from "./types";

export function AZSort({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 10.25L5.56818 8.25M5.56818 8.25L7 4.75L8.43182 8.25M5.56818 8.25H8.43182M8.43182 8.25L9.25 10.25M4.75 14.75H9.25L4.75 19.25H9.25M14.75 7.25L17 4.75M17 4.75L19.25 7.25M17 4.75V19.25M17 19.25L14.75 16.75M17 19.25L19.25 16.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
