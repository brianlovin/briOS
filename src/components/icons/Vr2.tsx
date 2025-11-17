import { IconProps } from "./types";

export function Vr2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m7.75 10.75 1.75 3.5 1.75-3.5m2.5 2.25v-2.25h1.5a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1h-.625m-.875 0v1.25m0-1.25h.875m0 0 1.625 1.25m-8.5 5h8.5a3 3 0 0 0 3-3v-8.5a3 3 0 0 0-3-3h-8.5a3 3 0 0 0-3 3v8.5a3 3 0 0 0 3 3Z"
      />
    </svg>
  );
}
