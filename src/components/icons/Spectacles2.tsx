import { IconProps } from "./types";

export function Spectacles2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13.764 15.75h-3.528M5.75 16a2.25 2.25 0 1 0 4.5 0 2.25 2.25 0 0 0-4.5 0Zm0 0-.121-.121a3 3 0 0 1-.879-2.122V8.828a2 2 0 0 1 .586-1.414L7 5.75M18.25 16a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm0 0 .121-.121a3 3 0 0 0 .879-2.122V8.828a2 2 0 0 0-.586-1.414L17 5.75"
      />
    </svg>
  );
}
