import { IconProps } from "./types";

export function NumberedList({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.25 9.25v-3.5l-1.5.5m1.5 3h-1.5m1.5 0h1m3.5-1.5h6.5m-6.5 8.5h6.5m-10 2h-2.5l2.227-2.038a.841.841 0 0 0-.568-1.462H6.25a.5.5 0 0 0-.5.5"
      />
    </svg>
  );
}
