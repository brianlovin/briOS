import { IconProps } from "./types";

export function BrowserHistory({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 8.25v8a2 2 0 0 0 2 2h6.5m-8.5-10v-.5a2 2 0 0 1 2-2h10.5a2 2 0 0 1 2 2v.5H4.75Zm12 9.5 1.25 1.5 1.25-1.5m-2.5-4.5 1.25-1.5 1.25 1.5"
      />
    </svg>
  );
}
