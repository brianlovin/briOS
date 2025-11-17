import { IconProps } from "./types";

export function Xls({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M8.25 15.25L4.75 8.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.75 8.75V15.25H13.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 8.75H17.5C16.5335 8.75 15.75 9.5335 15.75 10.5C15.75 11.4665 16.5335 12.25 17.5 12.25H17.75C18.5784 12.25 19.25 12.9216 19.25 13.75C19.25 14.5784 18.5784 15.25 17.75 15.25H15.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 15.25L8.25 8.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
