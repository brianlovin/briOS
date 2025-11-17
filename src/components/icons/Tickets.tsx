import { IconProps } from "./types";

export function Tickets({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="#141414"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.25 5.75h-2.5a1 1 0 0 0-1 1v5.5m10.07-3.533c-1.786-1.074-.573-3.263-.573-3.263l-.946-.568a.95.95 0 0 0-1.325.37L6.88 14.448a1.034 1.034 0 0 0 .355 1.381l5.464 3.285a.95.95 0 0 0 1.325-.37l5.096-9.192a1.034 1.034 0 0 0-.355-1.381l-.946-.569s-1.213 2.19-3 1.115Z"
      />
    </svg>
  );
}
