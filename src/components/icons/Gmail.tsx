import { IconProps } from "./types";

export function Gmail({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H8.25V19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V6.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 6.75C19.25 5.64543 18.3546 4.75 17.25 4.75H15.75V19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25V6.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.25 4.75L12 9.25L15.75 4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 8.25L12 15.25L5 8.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
