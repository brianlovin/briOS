import { IconProps } from "./types";

export function Keyboard2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.75 12.75h8.5m-8.5 3.5h8.5m-4.5-6.5h-5a2 2 0 0 0-2 2v5.5a2 2 0 0 0 2 2h10.5a2 2 0 0 0 2-2v-5.5a2 2 0 0 0-2-2h-5.5Zm0 0v-1.5a1 1 0 0 1 1-1h4.5a1 1 0 0 0 1-1v-1.5"
      />
    </svg>
  );
}
