import { IconProps } from "./types";

export function Beach({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12 14.75C6 14.75 4.75 19.25 4.75 19.25H19.25C19.25 19.25 18 14.75 12 14.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 16.25V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 4.75C9.23858 4.75 6.75 7.23858 6.75 10C6.75 10 7.75 8.75 9.375 8.75C11 8.75 12 10 12 10C12 10 13 8.75 14.625 8.75C16.25 8.75 17.25 10 17.25 10C17.25 7.23858 14.7614 4.75 12 4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
