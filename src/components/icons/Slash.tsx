import { IconProps } from "./types";

export function Slash({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M11.5 18C11.5 18.2761 11.2761 18.5 11 18.5C10.7239 18.5 10.5 18.2761 10.5 18C10.5 17.7239 10.7239 17.5 11 17.5C11.2761 17.5 11.5 17.7239 11.5 18Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 18C15.5 18.2761 15.2761 18.5 15 18.5C14.7239 18.5 14.5 18.2761 14.5 18C14.5 17.7239 14.7239 17.5 15 17.5C15.2761 17.5 15.5 17.7239 15.5 18Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 18C19.5 18.2761 19.2761 18.5 19 18.5C18.7239 18.5 18.5 18.2761 18.5 18C18.5 17.7239 18.7239 17.5 19 17.5C19.2761 17.5 19.5 17.7239 19.5 18Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 18.25L9.25 5.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
