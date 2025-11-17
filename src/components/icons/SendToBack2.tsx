import { IconProps } from "./types";

export function SendToBack2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="#141414"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13.25 19.25h-6.5a2 2 0 0 1-2-2v-6.5m4-1v.5m10.5-.5v.5m-10.5 3.5v.5a1 1 0 0 0 1 1h.5m-1.5-9v-.5a1 1 0 0 1 1-1h.5m9 1.5v-.5a1 1 0 0 0-1-1h-.5m1.5 9v.5a1 1 0 0 1-1 1h-.5m-4 0h.5m-.5-10.5h.5"
      />
    </svg>
  );
}
