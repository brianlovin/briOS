import { IconProps } from "./types";

export function Cherry({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M16.75 13.5C13 10 13 4.75 13 4.75C13 4.75 8.75 5 8.75 10.5M11.25 13.5C11.25 15.0188 10.0188 16.25 8.5 16.25C6.98122 16.25 5.75 15.0188 5.75 13.5C5.75 11.9812 6.98122 10.75 8.5 10.75C10.0188 10.75 11.25 11.9812 11.25 13.5ZM19.25 16.5C19.25 18.0188 18.0188 19.25 16.5 19.25C14.9812 19.25 13.75 18.0188 13.75 16.5C13.75 14.9812 14.9812 13.75 16.5 13.75C18.0188 13.75 19.25 14.9812 19.25 16.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
