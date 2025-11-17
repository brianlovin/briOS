import { IconProps } from "./types";

export function Rewind({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16 15.8603L19.25 18.25V5.75L16 8.13971"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 12L13.25 5.75V18.25L4.75 12Z"
      />
    </svg>
  );
}
