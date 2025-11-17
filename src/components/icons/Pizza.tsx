import { IconProps } from "./types";

export function Pizza({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M5.75 16.75L12 4.75L18.25 16.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 12C11.5 12.2761 11.2761 12.5 11 12.5C10.7239 12.5 10.5 12.2761 10.5 12C10.5 11.7239 10.7239 11.5 11 11.5C11.2761 11.5 11.5 11.7239 11.5 12Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 14C14.5 14.2761 14.2761 14.5 14 14.5C13.7239 14.5 13.5 14.2761 13.5 14C13.5 13.7239 13.7239 13.5 14 13.5C14.2761 13.5 14.5 13.7239 14.5 14Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.25 16.75C14.75 20.25 9.25 20.25 5.75 16.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.9498 14.9497C14 18 10 18 7.05029 14.9497"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
