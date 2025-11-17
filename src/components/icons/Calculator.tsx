import { IconProps } from "./types";

export function Calculator({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="#141414"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 7.25h12.5m-9.5 6h.5m-.5-3h.5m-.5 6h.5m2.5-3h.5m-.5-3h.5m-.5 6h.5m2.5-3h.5m-.5-3h.5m-.5 6h.5m-7.5 3h8.5a2 2 0 0 0 2-2V6.75a2 2 0 0 0-2-2h-8.5a2 2 0 0 0-2 2v10.5a2 2 0 0 0 2 2Z"
      />
    </svg>
  );
}
