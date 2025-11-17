import { IconProps } from "./types";

export function Mirror({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M8.25 5.75H6.75C5.64543 5.75 4.75 6.64543 4.75 7.75V16.25C4.75 17.3546 5.64543 18.25 6.75 18.25H8.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.25 5.75H14.75M17.75 5.75H18.25C18.8023 5.75 19.25 6.19772 19.25 6.75V7.25M15.25 18.25H14.75M17.75 18.25H18.25C18.8023 18.25 19.25 17.8023 19.25 17.25V16.75M19.25 13.25V12.75M19.25 10.25V9.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 4.75V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
