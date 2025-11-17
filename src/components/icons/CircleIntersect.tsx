import { IconProps } from "./types";

export function CircleIntersect({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M15.25 10C15.25 12.8995 12.8995 15.25 10 15.25C7.10051 15.25 4.75 12.8995 4.75 10C4.75 7.10051 7.10051 4.75 10 4.75C12.8995 4.75 15.25 7.10051 15.25 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 14C19.25 16.8995 16.8995 19.25 14 19.25C11.1005 19.25 8.75 16.8995 8.75 14C8.75 11.1005 11.1005 8.75 14 8.75C16.8995 8.75 19.25 11.1005 19.25 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
