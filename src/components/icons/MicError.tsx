import { IconProps } from "./types";

export function MicError({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 4.75v1.5m0 3v-.5m-13.5 4s.25 4.5 6.25 4.5 6.25-4.5 6.25-4.5m-6.25 5v1.5M8.75 8a3.25 3.25 0 0 1 6.5 0v3a3.25 3.25 0 0 1-6.5 0V8Z"
      />
    </svg>
  );
}
