import { IconProps } from "./types";

export function CirclesGrid({ size = 20, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <circle cx="7" cy="7.5" r="3.25" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="17" cy="7.5" r="3.25" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="7" cy="16.5" r="3.25" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="17" cy="16.5" r="3.25" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}
