import { IconProps } from "./types";

export function DotsHorizontal({ size = 32, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        fill="currentColor"
        d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z"
      />
      <path
        fill="currentColor"
        d="M9 12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.55228 11 9 11.4477 9 12Z"
      />
      <path
        fill="currentColor"
        d="M17 12C17 12.5523 16.5523 13 16 13C15.4477 13 15 12.5523 15 12C15 11.4477 15.4477 11 16 11C16.5523 11 17 11.4477 17 12Z"
      />
    </svg>
  );
}

export function DotsHorizontalLarge({ size = 32, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M13 12.25C13 12.9404 12.4404 13.5 11.75 13.5C11.0596 13.5 10.5 12.9404 10.5 12.25C10.5 11.5596 11.0596 11 11.75 11C12.4404 11 13 11.5596 13 12.25Z"
        fill="currentColor"
      />
      <path
        d="M7.5 12.25C7.5 12.9404 6.94035 13.5 6.25 13.5C5.55965 13.5 5 12.9404 5 12.25C5 11.5596 5.55965 11 6.25 11C6.94035 11 7.5 11.5596 7.5 12.25Z"
        fill="currentColor"
      />
      <path
        d="M18.5 12.25C18.5 12.9404 17.9404 13.5 17.25 13.5C16.5596 13.5 16 12.9404 16 12.25C16 11.5596 16.5596 11 17.25 11C17.9404 11 18.5 11.5596 18.5 12.25Z"
        fill="currentColor"
      />
    </svg>
  );
}
