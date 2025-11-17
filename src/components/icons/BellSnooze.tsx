import { IconProps } from "./types";

export function BellSnooze({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9 16.5C9 16.5 9 19.25 12 19.25C15 19.25 15 16.5 15 16.5"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.25 12L19.25 16.25H4.75L6.75 12V10C6.75 7.10051 9.10051 4.75 12 4.75C12.8056 4.75 13.5688 4.93145 14.251 5.2557"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 8.75H14.25L12.75 11.25H14.25"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.75 4.75H19.25L16.75 8.25H19.25"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
