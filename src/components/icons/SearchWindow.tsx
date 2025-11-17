import { IconProps } from "./types";

export function SearchWindow({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 8.25v-.5a2 2 0 0 0-2-2H6.75a2 2 0 0 0-2 2v.5m14.5 0H4.75m14.5 0v2m-14.5-2v8a2 2 0 0 0 2 2h2.5m7.743-1.257 2.257 2.257m-4.015-1.53a2.485 2.485 0 1 0 0-4.97 2.485 2.485 0 0 0 0 4.97Z"
      />
    </svg>
  );
}
