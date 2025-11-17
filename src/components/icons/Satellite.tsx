import { IconProps } from "./types";

export function Satellite({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M10.5806 13.4194C13.0214 15.8602 16.799 16.0399 19.2398 13.5991L10.4009 4.76025C7.96016 7.20103 8.13984 10.9786 10.5806 13.4194Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 9L17.25 6.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.25 13.75L6.6136 17.5595C6.00616 18.1959 6.45721 19.25 7.33695 19.25H12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
