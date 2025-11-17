import { IconProps } from "./types";

export function FolderUp({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 10.25v-.5a2 2 0 0 0-2-2H4.75m0 0v9.5a2 2 0 0 0 2 2h4.5m-6.5-11.5v-1a2 2 0 0 1 2-2h4.063a2 2 0 0 1 1.755 1.042L13.5 7.75m1.25 8.5 2.25-2.5m0 0 2.25 2.5M17 13.75v5.5"
      />
    </svg>
  );
}
