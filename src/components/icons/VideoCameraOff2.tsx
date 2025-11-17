import { IconProps } from "./types";

export function VideoCameraOff2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 8.75v6.5a2 2 0 0 0 2 2h5.5m-5.5-10.5h8.5V10m-8.5-3.25-2-2m2 2 8.5 8.5m0 0V14m0 1.25 4 4m-4-5.25v-4m0 4 4 1.25v-6.5l-4 1.25"
      />
    </svg>
  );
}
