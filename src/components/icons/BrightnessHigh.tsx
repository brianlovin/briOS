import { IconProps } from "./types";

export function BrightnessHigh({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 4.75v1.5m0 11.5v1.5m5.127-12.377L16 8m-8 8-1.126 1.127M19.25 12h-1.5m-11.5 0h-1.5m12.377 5.127L16 16M8 8 6.874 6.873M15.25 12a3.25 3.25 0 1 1-6.5 0 3.25 3.25 0 0 1 6.5 0Z"
      />
    </svg>
  );
}
