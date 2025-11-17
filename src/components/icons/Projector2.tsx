import { IconProps } from "./types";

export function Projector2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.5 11.75H5.75a1 1 0 0 0-1 1v4.5a1 1 0 0 0 1 1h12.5a1 1 0 0 0 1-1v-4.5a1 1 0 0 0-1-1H12.5m-2.5-7v1.5m3.625-.528-.75 1.299m-6.5-1.3.75 1.3m7.625 7.729h1.5m-4-2.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
      />
    </svg>
  );
}
