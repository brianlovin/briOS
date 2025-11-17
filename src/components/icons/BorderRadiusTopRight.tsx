import { IconProps } from "./types";

export function BorderRadiusTopRight({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6 9v.01M6 12v.01m6-.01v.01M18 15v.01M6 15v.01M9 18v.01M6 18v.01m9-.01v.01M9 6v.01M18 18v.01M6 6v.01M12 18v.01m.75-12.26h1.5a4 4 0 0 1 4 4v1.5"
      />
    </svg>
  );
}
