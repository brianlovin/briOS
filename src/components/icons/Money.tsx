import { IconProps } from "./types";

export function Money({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M17.25 6.75H6.75C5.64543 6.75 4.75 7.64543 4.75 8.75V15.25C4.75 16.3546 5.64543 17.25 6.75 17.25H17.25C18.3546 17.25 19.25 16.3546 19.25 15.25V8.75C19.25 7.64543 18.3546 6.75 17.25 6.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.25 12C14.25 13.7949 13.2426 15.25 12 15.25C10.7574 15.25 9.75 13.7949 9.75 12C9.75 10.2051 10.7574 8.75 12 8.75C13.2426 8.75 14.25 10.2051 14.25 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.25 14.25C6.63071 14.25 7.75 15.3693 7.75 16.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.75 14.25C17.3693 14.25 16.25 15.3693 16.25 16.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.25 9.75C6.63071 9.75 7.75 8.63071 7.75 7.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.75 9.75C17.3693 9.75 16.25 8.63071 16.25 7.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
