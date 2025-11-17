import { IconProps } from "./types";

export function Car({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M18.2502 17.25H5.75C5.19772 17.25 4.75 16.8023 4.75 16.25V12.75C4.75 11.6454 5.64543 10.75 6.75 10.75H17.2502C18.3548 10.75 19.2502 11.6454 19.2502 12.75V16.25C19.2502 16.8023 18.8025 17.25 18.2502 17.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 14C8.5 14.2761 8.27614 14.5 8 14.5C7.72386 14.5 7.5 14.2761 7.5 14C7.5 13.7239 7.72386 13.5 8 13.5C8.27614 13.5 8.5 13.7239 8.5 14Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 14C16.5 14.2761 16.2761 14.5 16 14.5C15.7239 14.5 15.5 14.2761 15.5 14C15.5 13.7239 15.7239 13.5 16 13.5C16.2761 13.5 16.5 13.7239 16.5 14Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.2502 10.75H5.75L6.47147 6.4212C6.6322 5.45683 7.46657 4.75 8.44425 4.75H15.556C16.5337 4.75 17.368 5.45683 17.5288 6.4212L18.2502 10.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 17.75V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.25 17.75V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
