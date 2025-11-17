import { IconProps } from "./types";

export function BounceRight({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14.25 10.75c-3.25 3.25-3.167 6.707-4.222 8.5C8.972 17.457 8 12.799 4.75 12.799M17.5 8.25a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5Z"
      />
    </svg>
  );
}
