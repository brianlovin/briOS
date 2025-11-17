import { IconProps } from "./types";

export function EmojiXEyes({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M10.25 9.75L8.75 11.25M13.75 9.75C13.75 9.75 14.6642 10.6642 15.25 11.25M8.75 9.75L10.25 11.25M15.25 9.75L13.75 11.25M10.75 15.25H13.25M19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
