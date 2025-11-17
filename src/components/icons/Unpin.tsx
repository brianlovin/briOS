import { IconProps } from "./types";

export function Unpin({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.75 8.5V6.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V10l2 5.25H15.5M7.988 12 6.75 15.25H12v4M4.75 4.75l14.5 14.5"
      />
    </svg>
  );
}
