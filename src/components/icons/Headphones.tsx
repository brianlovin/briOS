import { IconProps } from "./types";

export function Headphones({ size = 20, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M19.25 16V12.25C19.25 8.24594 16.0041 5 12 5V5C7.99594 5 4.75 8.24594 4.75 12.25V16"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M4.75 15.45C4.75 13.9588 5.95883 12.75 7.45 12.75V12.75C8.44411 12.75 9.25 13.5559 9.25 14.55V17.45C9.25 18.4441 8.44411 19.25 7.45 19.25V19.25C5.95883 19.25 4.75 18.0412 4.75 16.55V15.45Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M14.75 14.55C14.75 13.5559 15.5559 12.75 16.55 12.75V12.75C18.0412 12.75 19.25 13.9588 19.25 15.45V16.55C19.25 18.0412 18.0412 19.25 16.55 19.25V19.25C15.5559 19.25 14.75 18.4441 14.75 17.45V14.55Z"
      />
    </svg>
  );
}
