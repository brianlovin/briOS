import { IconProps } from "./types";

export function Rotate({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M17.1265 6.87348C14.2952 4.04217 9.70478 4.04217 6.87348 6.87348C4.04217 9.70478 4.04217 14.2952 6.87348 17.1265C9.70478 19.9578 14.2952 19.9578 17.1265 17.1265C17.7603 16.4927 18.2522 15.7708 18.6023 15.0001"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 19.25V15.75C19.25 15.1977 18.8023 14.75 18.25 14.75H14.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
