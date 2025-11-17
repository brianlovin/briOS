import { IconProps } from "./types";

export function InsertColumn({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16 9.75v4.5M18.25 12h-4.5m-7-7.25h2.5a1 1 0 0 1 1 1v12.5a1 1 0 0 1-1 1h-2.5a1 1 0 0 1-1-1V5.75a1 1 0 0 1 1-1Z"
      />
    </svg>
  );
}
