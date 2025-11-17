import { IconProps } from "./types";

export function FaceStraight({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 14.75H14.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 10C10.5 10.2761 10.2761 10.5 10 10.5C9.72386 10.5 9.5 10.2761 9.5 10C9.5 9.72386 9.72386 9.5 10 9.5C10.2761 9.5 10.5 9.72386 10.5 10Z"
        stroke="currentColor"
      />
      <path
        d="M14.5 10C14.5 10.2761 14.2761 10.5 14 10.5C13.7239 10.5 13.5 10.2761 13.5 10C13.5 9.72386 13.7239 9.5 14 9.5C14.2761 9.5 14.5 9.72386 14.5 10Z"
        stroke="currentColor"
      />
    </svg>
  );
}
