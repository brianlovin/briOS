import { IconProps } from "./types";

export function InputCheck({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 9.25v-.5a2 2 0 0 0-2-2H6.75a2 2 0 0 0-2 2v4.5a2 2 0 0 0 2 2h4.5m8-2.5s-1.929 2.09-2.893 4.5l-1.607-1.929"
      />
    </svg>
  );
}
