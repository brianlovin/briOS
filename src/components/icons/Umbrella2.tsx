import { IconProps } from "./types";

export function Umbrella2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9.58896 14.589L8 13L5.75 12L19 5L12 18.25L11 16L9.58896 14.589ZM9.58896 14.589L7.60238 16.5755C6.94269 17.3192 5.83691 17.4655 5.00656 16.9189L4.75 16.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
