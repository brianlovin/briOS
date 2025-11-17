import { IconProps } from "./types";

export function BorderRadiusBottomLeft({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18 9v.01M18 12v.01M12 12v.01M18 15v.01m-12-6V9m3-2.99V6m-3 .01V6m9 12v.01M15 6v.01M18 18v.01M18 6v.01m-6 0V6m-.75 12.25h-1.5a4 4 0 0 1-4-4v-1.5"
      />
    </svg>
  );
}
