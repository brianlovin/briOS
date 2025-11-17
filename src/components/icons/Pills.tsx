import { IconProps } from "./types";

export function Pills({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M16.25 4.75V7.25H7.75L7.75 4.75L16.25 4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.2499 7.25V10.25L16.5669 11.4024C17.0009 11.7822 17.2499 12.3308 17.2499 12.9075V17.25C17.2499 18.3546 16.3545 19.25 15.2499 19.25H8.7649C7.66033 19.25 6.76489 18.3546 6.76489 17.25L6.76489 12.903C6.76489 12.3289 7.01162 11.7825 7.44227 11.4028L8.74989 10.25L8.74989 7.25L15.2499 7.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 16.25H13.25V12.75H7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
