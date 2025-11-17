import { IconProps } from "./types";

export function Bold({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M6.75 4.75H12.5C14.5711 4.75 16.25 6.42893 16.25 8.5C16.25 10.5711 14.5711 12.25 12.5 12.25H6.75V4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 12.25H13.75C15.683 12.25 17.25 13.817 17.25 15.75C17.25 17.683 15.683 19.25 13.75 19.25H6.75V12.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
