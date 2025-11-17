import { IconProps } from "./types";

export function TextLowercase({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 9.5C19.25 11.0188 18.0188 12.25 16.5 12.25C14.9812 12.25 13.75 11.0188 13.75 9.5C13.75 7.98122 14.9812 6.75 16.5 6.75C18.0188 6.75 19.25 7.98122 19.25 9.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.25 9.5C10.25 11.0188 9.01878 12.25 7.5 12.25C5.98122 12.25 4.75 11.0188 4.75 9.5C4.75 7.98122 5.98122 6.75 7.5 6.75C9.01878 6.75 10.25 7.98122 10.25 9.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 6.75V13.25C19.25 15.4591 17.4591 17.25 15.25 17.25H13.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.25 6.75V12.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
