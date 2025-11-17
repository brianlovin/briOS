import { IconProps } from "./types";

export function DataTransferCheck({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12.75 9.25 16 5.75m0 0 3.25 3.5M16 5.75v7.5m3.25 1.5s-1.929 2.09-2.893 4.5l-1.607-1.929m-3.5-2.571L8 18.25m0 0-3.25-3.5M8 18.25V5.75"
      />
    </svg>
  );
}
