import { IconProps } from "./types";

export function HumiditySensor({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16.75 4.75V5A2.25 2.25 0 0 0 19 7.25h.25m-6.5-2.5V5A6.25 6.25 0 0 0 19 11.25h.25m-10.5-6.5V5c0 5.66 4.59 10.25 10.25 10.25h.25M9.25 17a2.25 2.25 0 0 1-4.5 0c0-1.243 2.25-5.25 2.25-5.25S9.25 15.757 9.25 17Z"
      />
    </svg>
  );
}
