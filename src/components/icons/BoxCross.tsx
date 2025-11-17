import { IconProps } from "./types";

export function BoxCross({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 7.87 11 11.25M4.75 7.87v7L11 18.25v-7M4.75 7.87 11 4.75l6.25 3.12m0 0v4.38m0-4.38L11 11.25m4.75 4.5 1.75 1.75m0 0 1.75 1.75M17.5 17.5l1.75-1.75M17.5 17.5l-1.75 1.75"
      />
    </svg>
  );
}
