import { IconProps } from "./types";

export function Beer({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M17.25 9V4.75H6.75V9C6.75 11.5 8.75 12 8.75 15V18.25C8.75 18.8023 9.19771 19.25 9.75 19.25H14.25C14.8023 19.25 15.25 18.8031 15.25 18.2508V15C15.25 12 17.25 11.5 17.25 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 7.75H17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
