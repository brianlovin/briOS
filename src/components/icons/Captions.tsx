import { IconProps } from "./types";

export function Captions({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.75 10.25h2.5m-2.5 3h4.5m.5-3h.5m1.5 3h1.5m-.5-3h.5m-11.5-3.5v7.502a2 2 0 0 0 2 2h2.143v2.998L12 16.252h5.25a2 2 0 0 0 2-2V6.75a2 2 0 0 0-2-2H6.75a2 2 0 0 0-2 2Z"
      />
    </svg>
  );
}
