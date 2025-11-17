import { IconProps } from "./types";

export function LampCeiling({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 9.75H9.868a2 2 0 0 0-1.704.952L4.75 16.25h14.5l-3.414-5.548a2 2 0 0 0-1.704-.952H12Zm0 0v-5M9.75 16.5v.5a2.25 2.25 0 0 0 4.5 0v-.5"
      />
    </svg>
  );
}
