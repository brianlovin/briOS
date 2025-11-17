import { IconProps } from "./types";

export function Diamonds({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9.5 9C10.7644 7.54767 12 4.75 12 4.75C12 4.75 13.2356 7.54767 14.5 9C15.7314 10.4145 18.25 12 18.25 12C18.25 12 15.7314 13.5855 14.5 15C13.2356 16.4523 12 19.25 12 19.25C12 19.25 10.7644 16.4523 9.5 15C8.26857 13.5855 5.75 12 5.75 12C5.75 12 8.26857 10.4145 9.5 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
