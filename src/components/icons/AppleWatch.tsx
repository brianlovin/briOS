import { IconProps } from "./types";

export function AppleWatch({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9 7L9.73606 5.34386C9.89656 4.98273 10.2547 4.75 10.6499 4.75H13.3501C13.7453 4.75 14.1034 4.98273 14.2639 5.34386L15 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 17L9.73606 18.6561C9.89656 19.0173 10.2547 19.25 10.6499 19.25H13.3501C13.7453 19.25 14.1034 19.0173 14.2639 18.6561L15 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 10.75C6.75 8.54086 8.54086 6.75 10.75 6.75H13.25C15.4591 6.75 17.25 8.54086 17.25 10.75V13.25C17.25 15.4591 15.4591 17.25 13.25 17.25H10.75C8.54086 17.25 6.75 15.4591 6.75 13.25V10.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
