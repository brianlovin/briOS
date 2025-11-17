import { IconProps } from "./types";

export function EarOff({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentCollor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m4.75 4.75 14.5 14.5m-10.5-2.5v.5a2 2 0 0 0 2 2H12c.793 0 1.385-.528 1.823-1.25M7.5 7.407C8.442 5.854 10.16 4.75 12 4.75c2.761 0 5.25 2.489 5.25 5.25a4.55 4.55 0 0 1-.749 2.536c-.516.787-1.081 1.6-1.49 2.464m-.761-4.75V10a2.25 2.25 0 0 0-4.444-.5"
      />
    </svg>
  );
}
