import { IconProps } from "./types";

export function Bonfire({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m4.75 14.75 14.5 4.5m0-4.5-14.5 4.5m7.25-6c1.82 0 3.25-.733 3.25-3.078 0-2.344-2.73-2.784-2.73-5.422-.693.537-1.768 2.872-.52 4.983-.693.049-2.08-.997-2.08-2.638-.52.39-1.17 1.67-1.17 3.077S9.92 13.25 12 13.25Z"
      />
    </svg>
  );
}
