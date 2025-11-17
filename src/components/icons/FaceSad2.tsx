import { IconProps } from "./types";

export function FaceSad2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9.75 14.75C9.75 14.75 10.5 13.75 12 13.75C13.5 13.75 14.25 14.75 14.25 14.75M10.25 9.75L8.75 11.25M13.75 9.75L15.25 11.25M19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
