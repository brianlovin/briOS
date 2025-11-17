import { IconProps } from "./types";

export function Highlighter2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m8.782 8.968-3.446 3.446a2 2 0 0 0-.586 1.415v2.421h7.5l1.898-1.897M8.782 8.968l-.33-.33a1 1 0 0 1 0-1.412L10.75 4.75M8.782 8.968l5.366 5.385m0 0 .185.186a1 1 0 0 0 1.417 0l3.5-3.516M4.75 19.25h14.5"
      />
    </svg>
  );
}
