import { IconProps } from "./types";

export function People({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M11.25 7C11.25 8.24264 10.2426 9.25 9 9.25C7.75736 9.25 6.75 8.24264 6.75 7C6.75 5.75736 7.75736 4.75 9 4.75C10.2426 4.75 11.25 5.75736 11.25 7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.75 9.25C15.9926 9.25 17.25 8.24264 17.25 7C17.25 5.75736 15.9926 4.75 14.75 4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 9.75C5.6 9.75 4.75 11.5 4.75 14.25H6.75V17.25C6.75 18.3546 7.64543 19.25 8.75 19.25H9.25C10.3546 19.25 11.25 18.3546 11.25 17.25V14.25H13.25C13.25 11.5 12.4 9.75 9 9.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.75 9.25C18.15 9.25 19.25 11.5 19.25 14.25H17.25V17.25C17.25 18.3546 16.3546 19.25 15.25 19.25H14.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
