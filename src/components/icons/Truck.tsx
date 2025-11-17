import { IconProps } from "./types";

export function Truck({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M15.2502 15.25H4.75V4.75H15.2502V15.25Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.25 17.5C9.25 18.4665 8.4665 19.25 7.5 19.25C6.5335 19.25 5.75 18.4665 5.75 17.5C5.75 16.5335 6.5335 15.75 7.5 15.75C8.4665 15.75 9.25 16.5335 9.25 17.5Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18.25 17.5C18.25 18.4665 17.4665 19.25 16.5 19.25C15.5335 19.25 14.75 18.4665 14.75 17.5C14.75 16.5335 15.5335 15.75 16.5 15.75C17.4665 15.75 18.25 16.5335 18.25 17.5Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.2502 15.25H15.25V8.75H16.2502C17.9071 8.75 19.2502 10.0931 19.2502 11.75V15.25Z"
      />
    </svg>
  );
}
