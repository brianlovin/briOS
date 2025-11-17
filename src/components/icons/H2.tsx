import { IconProps } from "./types";

export function H2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 7.75v8.5m5.5-8.5v8.5m-5.25-4h5m7.25 4h-3.5v-.59a2 2 0 0 1 .456-1.272l2.588-3.142a2 2 0 0 0 .456-1.271V9.5a1.75 1.75 0 1 0-3.5 0v.212"
      />
    </svg>
  );
}
