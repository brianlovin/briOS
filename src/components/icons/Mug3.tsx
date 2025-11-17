import { IconProps } from "./types";

export function Mug3({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 17.25V8.75H7.75V17.25C7.75 18.3546 8.64543 19.25 9.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 10.75H6.75C5.64543 10.75 4.75 11.6454 4.75 12.75V14.25C4.75 15.3546 5.64543 16.25 6.75 16.25H7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.25 4.75V6.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.25 4.75C8.25 4.75 9.25 4.75 9.25 6.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.25 4.75C18.25 4.75 17.25 4.75 17.25 6.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
