import { IconProps } from "./types";

export function Stethoscope({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.0295 19.0295C18.5602 19.4988 17.495 19.1944 16.6503 18.3497C15.8056 17.505 15.5012 16.4398 15.9705 15.9705C16.4398 15.5012 17.505 15.8056 18.3497 16.6503C19.1944 17.495 19.4988 18.5602 19.0295 19.0295Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 18.25H13.75C11.5409 18.25 9.75 16.4591 9.75 14.25V12.25M9.75 12.25H8.75C6.54086 12.25 4.75 10.4591 4.75 8.25V4.75M9.75 12.25H11.25C13.4591 12.25 15.25 10.4591 15.25 8.25V4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
