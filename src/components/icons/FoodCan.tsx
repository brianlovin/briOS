import { IconProps } from "./types";

export function FoodCan({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18.25 7c0 1.243-2.798 2.25-6.25 2.25S5.75 8.243 5.75 7m12.5 0c0-1.243-2.798-2.25-6.25-2.25S5.75 5.757 5.75 7m12.5 0v10c0 1.243-2.798 2.25-6.25 2.25S5.75 18.243 5.75 17V7m4 5.75h4.5v3.5h-4.5v-3.5Z"
      />
    </svg>
  );
}
