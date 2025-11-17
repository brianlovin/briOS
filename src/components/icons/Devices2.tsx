import { IconProps } from "./types";

export function Devices2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.25 17.25h-1.5a2 2 0 0 1-2-2v-8.5a2 2 0 0 1 2-2h10.5a1.99 1.99 0 0 1 1.476.65M13.75 19.25h3.5a2 2 0 0 0 2-2v-6.5a2 2 0 0 0-2-2h-3.5a2 2 0 0 0-2 2v6.5a2 2 0 0 0 2 2Z"
      />
    </svg>
  );
}
