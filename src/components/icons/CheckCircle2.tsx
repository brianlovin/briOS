import { IconProps } from "./types";

export function CheckCircle2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M14.25 10C14.25 10 12.3214 12.0893 11.3571 14.5L9.75 12.5714M19.25 12.25C19.25 16.2541 16.0041 19.5 12 19.5C7.99594 19.5 4.75 16.2541 4.75 12.25C4.75 8.24594 7.99594 5 12 5C16.0041 5 19.25 8.24594 19.25 12.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
