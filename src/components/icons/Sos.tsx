import { IconProps } from "./types";

export function Sos({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.25 8.75h-1a1.5 1.5 0 0 0-1.5 1.5v.5a1 1 0 0 0 1 1 1.5 1.5 0 0 1 1.5 1.5v.25a1.75 1.75 0 0 1-1.75 1.75h-.75m12.5-6.5h-1a1.5 1.5 0 0 0-1.5 1.5v.5a1 1 0 0 0 1 1 1.5 1.5 0 0 1 1.5 1.5v.25a1.75 1.75 0 0 1-1.75 1.75h-.75M13.25 10v4a1.25 1.25 0 1 1-2.5 0v-4a1.25 1.25 0 1 1 2.5 0Z"
      />
    </svg>
  );
}
