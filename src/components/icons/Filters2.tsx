import { IconProps } from "./types";

export function Filters2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M17.25 10C17.25 12.8995 14.8994 15.25 12 15.25C9.1006 15.25 6.75 12.8995 6.75 10C6.75 7.10051 9.1006 4.75 12 4.75C14.8994 4.75 17.25 7.10051 17.25 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.25 14.5C14.25 17.1234 12.1233 19.25 9.5 19.25C6.87673 19.25 4.75 17.1234 4.75 14.5C4.75 11.8766 6.87673 9.75 9.5 9.75C12.1233 9.75 14.25 11.8766 14.25 14.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 14.5C19.25 17.1234 17.1233 19.25 14.5 19.25C11.8767 19.25 9.75 17.1234 9.75 14.5C9.75 11.8766 11.8767 9.75 14.5 9.75C17.1233 9.75 19.25 11.8766 19.25 14.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
