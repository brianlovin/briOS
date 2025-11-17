import { IconProps } from "./types";

export function FlipHorizontal({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 9.25v-4.5m0 4.5 2.25-2.5M12 9.25l-2.25-2.5m2.25 8v4.5m0-4.5 2.25 2.5M12 14.75l-2.25 2.5m9.5-5.25h-1.5m-2.5 0h-.5m-2.5 0h-.5m-2.5 0h-.5m-2.5 0h-1.5"
      />
    </svg>
  );
}
