import { IconProps } from "./types";

export function BorderLeft({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18 9v.01M18 12v.01M12 12v.01M18 15v.01M9 6v.01M9 18v.01M15 6v.01M15 18v.01M18 6v.01M18 18v.01M12 6v.01M12 18v.01m-6.25.24V5.75"
      />
    </svg>
  );
}
