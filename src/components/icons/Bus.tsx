import { IconProps } from "./types";

export function Bus({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M5.75 6.75C5.75 5.64543 6.64543 4.75 7.75 4.75H16.25C17.3546 4.75 18.25 5.64543 18.25 6.75V16.25C18.25 16.8023 17.8023 17.25 17.25 17.25H6.75C6.19772 17.25 5.75 16.8023 5.75 16.25V6.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 10.25C5.08579 10.25 4.75 9.91421 4.75 9.5C4.75 9.08579 5.08579 8.75 5.5 8.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 10.25C18.9142 10.25 19.25 9.91421 19.25 9.5C19.25 9.08579 18.9142 8.75 18.5 8.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.75 18V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.25 18V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 11.25H18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 11.25V5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 14C9.5 14.2761 9.27614 14.5 9 14.5C8.72386 14.5 8.5 14.2761 8.5 14C8.5 13.7239 8.72386 13.5 9 13.5C9.27614 13.5 9.5 13.7239 9.5 14Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 14C15.5 14.2761 15.2761 14.5 15 14.5C14.7239 14.5 14.5 14.2761 14.5 14C14.5 13.7239 14.7239 13.5 15 13.5C15.2761 13.5 15.5 13.7239 15.5 14Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
