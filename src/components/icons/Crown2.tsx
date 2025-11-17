import { IconProps } from "./types";

export function Crown2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M6.75 16.75L4.75 6.75L9 9.25L12 4.75L15 9.25L19.25 6.75L17.25 16.75H6.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.25 16.75H6.75C5.64543 16.75 4.75 17.6454 4.75 18.75V19.25H19.25V18.75C19.25 17.6454 18.3546 16.75 17.25 16.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
