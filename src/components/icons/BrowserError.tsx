import { IconProps } from "./types";

export function BrowserError({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.75 4.75h-2a3 3 0 0 0-3 3v8.5a3 3 0 0 0 3 3h2.5m-.5-14.5v2.5a1 1 0 0 0 1 1h3.5m-4.5-3.5h4.5m5 3.5v-.5a3 3 0 0 0-3-3h-2m5 3.5h-5m5 0v2m-5-2v-3.5m.363 9.75a2.75 2.75 0 0 1 3.887 3.887M14.613 14.5a2.75 2.75 0 1 0 3.887 3.887M14.613 14.5l3.887 3.887"
      />
    </svg>
  );
}
