import { IconProps } from "./types";

export function Command({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 6.5C4.75 5.5335 5.5335 4.75 6.5 4.75C7.4665 4.75 8.25 5.5335 8.25 6.5V8.25H6.5C5.5335 8.25 4.75 7.4665 4.75 6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 6.5C15.75 5.5335 16.5335 4.75 17.5 4.75C18.4665 4.75 19.25 5.5335 19.25 6.5C19.25 7.4665 18.4665 8.25 17.5 8.25H15.75V6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 15.75H17.5C18.4665 15.75 19.25 16.5335 19.25 17.5C19.25 18.4665 18.4665 19.25 17.5 19.25C16.5335 19.25 15.75 18.4665 15.75 17.5V15.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 17.5C4.75 16.5335 5.5335 15.75 6.5 15.75H8.25V17.5C8.25 18.4665 7.4665 19.25 6.5 19.25C5.5335 19.25 4.75 18.4665 4.75 17.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.25 8.25H15.75V15.75H8.25V8.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
