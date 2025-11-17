import { IconProps } from "./types";

export function EaseInControl({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 4.75S18 15.5 4.75 18.25m3-.25h.5m2.5 0h.5m2.5 0h.5m2.5 0a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0Z"
      />
    </svg>
  );
}
