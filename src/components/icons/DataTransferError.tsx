import { IconProps } from "./types";

export function DataTransferError({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12.75 9.25 16 5.75m0 0 3.25 3.5M16 5.75v5.5m-1.444 3.306 3.889 3.889M11.25 14.75 8 18.25m0 0-3.25-3.5M8 18.25V5.75M19.25 16.5a2.75 2.75 0 1 1-5.5 0 2.75 2.75 0 0 1 5.5 0Z"
      />
    </svg>
  );
}
