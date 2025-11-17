import { IconProps } from "./types";

export function Ladder2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m7.75 19.25 1.612-11m0 0 .262-1.79a2 2 0 0 1 1.98-1.71h.793a2 2 0 0 1 1.979 1.71l.262 1.79m-5.276 0h5.276m0 0 1.612 11m-7.438-7h6.376m-6.962 4h7.548"
      />
    </svg>
  );
}
