import { IconProps } from "./types";

export function FlagPriority({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 5.75V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 15.25V5.75C19.25 5.75 18.5 6.25 16 6.25C13.5 6.25 12 4.75 9 4.75C6 4.75 4.75 5.75 4.75 5.75V15.25C4.75 15.25 6.5 14.25 9 14.25C11.5 14.25 13.5 16.25 16 16.25C18.5 16.25 19.25 15.25 19.25 15.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
