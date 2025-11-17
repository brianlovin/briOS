import { IconProps } from "./types";

export function TimerSnooze({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 12A7.25 7.25 0 1 1 12 4.75m.25 4V12l-1.5 1.25m6-8.5h2.5l-2.5 3.5h2.5"
      />
    </svg>
  );
}
