import { IconProps } from "./types";

export function CameraGrid({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 16.75v.5a2 2 0 0 0 2 2h.5m-2.5-12v-.5a2 2 0 0 1 2-2h.5m12 12v.5a2 2 0 0 1-2 2h-.5m2.5-12v-.5a2 2 0 0 0-2-2h-.5m-9 4v6a1 1 0 0 0 1 1h6.5a1 1 0 0 0 1-1v-6H14l-1-1.5h-2l-1 1.5H7.75Zm5.5 3.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z"
      />
    </svg>
  );
}
