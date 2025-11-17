import { IconProps } from "./types";

export function TwoCheckmarks({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m5.75 12.464 2.833 2.786c1.417-4.179 4.667-6.5 4.667-6.5m5 0s-4.25 2.321-5.667 6.5l-1.102-1.083"
      />
    </svg>
  );
}
