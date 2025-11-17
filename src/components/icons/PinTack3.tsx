import { IconProps } from "./types";

export function PinTack3({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 15.5v3.75M8.75 10V6.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V10l2 5.25H6.75l2-5.25Z"
      />
    </svg>
  );
}
