import { IconProps } from "./types";

export function MicMinus({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M15.093 12a3.251 3.251 0 0 1-6.343-1V8A3.25 3.25 0 0 1 12 4.75h.25m7 2.25h-4.5m-9 5.75s.25 4.5 6.25 4.5 6.25-4.5 6.25-4.5m-6.25 5v1.5"
      />
    </svg>
  );
}
