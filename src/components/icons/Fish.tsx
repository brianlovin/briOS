import { IconProps } from "./types";

export function Fish({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.12883 10.1288L4.75 7.75V16.25L7.12883 13.8712C8.18889 15.0112 9.8382 16.25 12 16.25C16.0041 16.25 19.25 14.3472 19.25 12C19.25 9.65279 16.0041 7.75 12 7.75C9.8382 7.75 8.18889 8.98884 7.12883 10.1288Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 12C15.5 12.2761 15.2761 12.5 15 12.5C14.7239 12.5 14.5 12.2761 14.5 12C14.5 11.7239 14.7239 11.5 15 11.5C15.2761 11.5 15.5 11.7239 15.5 12Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
