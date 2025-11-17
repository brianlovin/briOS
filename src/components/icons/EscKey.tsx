import { IconProps } from "./types";

export function EscKey({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.25 15.25h-1.5a1 1 0 0 1-1-1V12m2.5-3.25h-1.5a1 1 0 0 0-1 1V12m0 0h2.5m6-3.25h-.875c-.898 0-1.625.728-1.625 1.625v.375c0 .69.56 1.25 1.25 1.25s1.25.56 1.25 1.25v.375c0 .898-.727 1.625-1.625 1.625h-.875m8.5-6.5h-.5a2 2 0 0 0-2 2v2.5a2 2 0 0 0 2 2h.5"
      />
    </svg>
  );
}
