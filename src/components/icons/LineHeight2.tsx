import { IconProps } from "./types";

export function LineHeight2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 19.25H19.25M9.25 13.25H14.75M9.25 13.25L7.75 16.25M9.25 13.25L12 7.75L14.75 13.25M14.75 13.25L16.25 16.25M4.75 4.75H19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
