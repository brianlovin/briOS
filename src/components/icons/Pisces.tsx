import { IconProps } from "./types";

export function Pisces({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 4.75C4.75 4.75 8.25 8.06294 8.25 12C8.25 15.9371 4.75 19.25 4.75 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 4.75C19.25 4.75 15.75 8.06294 15.75 12C15.75 15.9371 19.25 19.25 19.25 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.75 12.25H18.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
