import { IconProps } from "./types";

export function Ufo2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M8.75 15.75L6.75 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.25 15.75L17.25 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.25 8.75H8.75C7.09315 8.75 5.75 10.0931 5.75 11.75V12.25H18.25V11.75C18.25 10.0931 16.9069 8.75 15.25 8.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.75 8.75C7.75 6.40279 9.65279 4.75 12 4.75C14.3472 4.75 16.25 6.40279 16.25 8.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
