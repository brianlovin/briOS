import { IconProps } from "./types";

export function Scan({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.641 9.764a3.25 3.25 0 1 0 3.173-.911l-.06-.014m-.504 3.411L6.875 6.875l-.017.014A7.25 7.25 0 1 0 9.8 5.09"
      />
    </svg>
  );
}
