import { IconProps } from "./types";

export function FaceCheck({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        d="M10.5 11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm4 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 12A7.25 7.25 0 1 1 12 4.75m2.75 2 1.5 1.5c.75-2.25 3-3.5 3-3.5m-9.5 10s.75 1 2.25 1 2.25-1 2.25-1"
      />
    </svg>
  );
}
