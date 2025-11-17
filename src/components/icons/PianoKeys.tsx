import { IconProps } from "./types";

export function PianoKeys({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.75 5.75h-2a1 1 0 0 0-1 1v10.5a1 1 0 0 0 1 1h12.5a1 1 0 0 0 1-1V6.75a1 1 0 0 0-1-1h-2m-8.5 0v6.5a1 1 0 0 0 1 1H9m-1.25-7.5a1 1 0 0 1 1-1h.5a1 1 0 0 1 1 1m6 0v6.5a1 1 0 0 1-1 1H15m1.25-7.5a1 1 0 0 0-1-1h-.5a1 1 0 0 0-1 1m-3.5 0h3.5m-3.5 0v6.5a1 1 0 0 1-1 1H9m4.75-7.5v6.5a1 1 0 0 0 1 1H15m-6 0v5m6-5v5"
      />
    </svg>
  );
}
