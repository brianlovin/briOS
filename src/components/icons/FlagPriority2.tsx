import { IconProps } from "./types";

export function FlagPriority2({ size = 20, ...rest }: IconProps) {
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
        d="M4.75 15.25V5.75C4.75 5.75 6 4.75 9 4.75C12 4.75 13.5 6.25 16 6.25C18.5 6.25 19.25 5.75 19.25 5.75L15.75 10.5L19.25 15.25C19.25 15.25 18.5 16.25 16 16.25C13.5 16.25 11.5 14.25 9 14.25C6.5 14.25 4.75 15.25 4.75 15.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
