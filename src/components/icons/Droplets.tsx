import { IconProps } from "./types";

export function Droplets({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 15.8095C19.25 17.8333 17.7949 19.25 16 19.25C14.2051 19.25 12.75 17.8333 12.75 15.8095C12.75 13.7857 16 10.75 16 10.75C16 10.75 19.25 13.7857 19.25 15.8095Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.25 9.80952C11.25 11.8333 9.79493 13.25 8 13.25C6.20507 13.25 4.75 11.8333 4.75 9.80952C4.75 7.78571 8 4.75 8 4.75C8 4.75 11.25 7.78571 11.25 9.80952Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
