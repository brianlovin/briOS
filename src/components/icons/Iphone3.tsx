import { IconProps } from "./types";

export function Iphone3({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18.25 19.25V6.75a2 2 0 0 0-2-2h-8.5a2 2 0 0 0-2 2v12.5m5-11.5h2.5"
      />
    </svg>
  );
}
