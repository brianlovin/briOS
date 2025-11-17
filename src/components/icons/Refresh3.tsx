import { IconProps } from "./types";

export function Refresh3({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M11.25 14.75L8.75 17M8.75 17L11.25 19.25M8.75 17H13.25C16.5637 17 19.25 14.3137 19.25 11V10.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.25 7H10.75C7.43629 7 4.75 9.68629 4.75 13V13.25M15.25 7L12.75 9.25M15.25 7L12.75 4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
