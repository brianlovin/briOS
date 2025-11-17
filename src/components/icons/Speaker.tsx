import { IconProps } from "./types";

export function Speaker({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M17.25 4.75L10.5 8.75H7.75C7.19772 8.75 6.75 9.19772 6.75 9.75V14.25C6.75 14.8023 7.19772 15.25 7.75 15.25H10.5L17.25 19.25V4.75Z"
      />
    </svg>
  );
}
