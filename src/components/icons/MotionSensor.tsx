import { IconProps } from "./types";

export function MotionSensor({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 19.25s1.275-2.5 4.25-2.5 4.25 2.5 4.25 2.5m-2-7.25a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm5.5-7.25V5A2.25 2.25 0 0 0 19 7.25h.25m-6.5-2.5V5A6.25 6.25 0 0 0 19 11.25h.25"
      />
    </svg>
  );
}
