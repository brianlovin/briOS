import { IconProps } from "./types";

export function BrightnessLow({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 4.75v.5m0 13.5v.5m5.127-12.377L16.5 7.5m-9 9-.626.627M19.25 12h-.5m-13.5 0h-.5m12.377 5.127L16.5 16.5m-9-9-.626-.627M14.25 12a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
      />
    </svg>
  );
}
