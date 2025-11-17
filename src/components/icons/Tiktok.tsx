import { IconProps } from "./types";

export function Tiktok({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M18.25 8.25C18.25 8.25 14.25 7.75 14.25 4.75V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.25 15C14.25 17.3472 12.3472 19.25 10 19.25C7.65279 19.25 5.75 17.3472 5.75 15C5.75 12.6528 7.90279 10.75 10.25 10.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
