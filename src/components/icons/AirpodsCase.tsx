import { IconProps } from "./types";

export function AirpodsCase({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 10.75v4a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-4m-14 0v-1.5a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v1.5m-14 0h4m10 0h-4m-6 0h6m-6 0a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5"
      />
    </svg>
  );
}
