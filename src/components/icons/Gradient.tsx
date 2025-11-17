import { IconProps } from "./types";

export function Gradient({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9 12h.01M6 12h.01M9 16h.01M6 16h.01M12 12h.01M12 16h.01M15 12h.01M18 12h.01M15 16h.01M18 16h.01m-4.51-2h.01m-.01 4h.01m-3.01-4h.01m-.01 4h.01M7.5 14h.01m-.01 4h.01M17 14h.01M17 18h.01M5.75 19.25h12.5a1 1 0 0 0 1-1V5.75a1 1 0 0 0-1-1H5.75a1 1 0 0 0-1 1v12.5a1 1 0 0 0 1 1Z"
      />
    </svg>
  );
}
