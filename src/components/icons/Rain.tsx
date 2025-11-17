import { IconProps } from "./types";

export function Rain({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 12C4.75 13.7949 6.20507 15.25 8 15.25H16C17.7949 15.25 19.25 13.7949 19.25 12C19.25 10.2869 17.9246 8.88339 16.2433 8.75897C16.1183 6.5239 14.2663 4.75 12 4.75C9.73368 4.75 7.88168 6.5239 7.75672 8.75897C6.07542 8.88339 4.75 10.2869 4.75 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.75 17.75L8.25 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.75 17.75L12.25 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 17.75L16.25 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
