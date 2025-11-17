import { IconProps } from "./types";

export function HideKeyboard({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.75 12.75h8.5m-8.5 3.5h3.5m.5-6.5h-5a2 2 0 0 0-2 2v5.5a2 2 0 0 0 2 2H11m.75-9.5h5.5a2 2 0 0 1 2 2v1.5m-7.5-3.5v-1a2 2 0 0 1 2-2h2.5a2 2 0 0 0 2-2m-3.5 12 2.25 2.5 2.25-2.5"
      />
    </svg>
  );
}
