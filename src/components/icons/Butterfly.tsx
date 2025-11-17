import { IconProps } from "./types";

export function Butterfly({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 7s-1.817-2.25-3.75-2.25a3.5 3.5 0 1 0 0 7c-2.071 0-3.5 1.679-3.5 3.75a3.75 3.75 0 0 0 3.75 3.75c1.595 0 2.958-1.096 3.5-2.5.542 1.404 1.905 2.5 3.5 2.5a3.75 3.75 0 0 0 3.75-3.75c0-2.071-1.429-3.75-3.5-3.75a3.5 3.5 0 1 0 0-7C13.817 4.75 12 7 12 7Zm0 0v6.25M12 7V4.75"
      />
    </svg>
  );
}
