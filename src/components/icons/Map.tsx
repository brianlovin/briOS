import { IconProps } from "./types";

export function Map({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 6.75L9.25 4.75V17.25L4.75 19.25V6.75Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14.75 6.75L19.25 4.75V17.25L14.75 19.25V6.75Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14.75 6.75L9.25 4.75V17.25L14.75 19.25V6.75Z"
      />
    </svg>
  );
}
