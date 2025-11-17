import { IconProps } from "./types";

export function FaceYawn({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M10.25 8.75L8.75 9.25M13.75 8.75L15.25 9.25M19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12ZM14.25 14C14.25 15.2426 13.2426 16.25 12 16.25C10.7574 16.25 9.75 15.2426 9.75 14C9.75 12.7574 10.7574 11.75 12 11.75C13.2426 11.75 14.25 12.7574 14.25 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
