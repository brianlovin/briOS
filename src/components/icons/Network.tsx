import { IconProps } from "./types";

export function Network({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="#141414"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8 8h.01M8 16h.01M16 8h.01M16 16h.01m-2.76-4a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm0-6a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm6 6a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm-12 0a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm6 6a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z"
      />
    </svg>
  );
}
