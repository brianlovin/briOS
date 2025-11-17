import { IconProps } from "./types";

export function SdCard({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10.75 8.75v1.5m3-1.5v1.5m-8-5.5H14L18.25 9v10.25H5.75v-6.5h.5a1 1 0 0 0 1-1v-.5a1 1 0 0 0-1-1h-.5v-5.5Z"
      />
    </svg>
  );
}
