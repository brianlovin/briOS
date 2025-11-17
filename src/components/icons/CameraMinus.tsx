import { IconProps } from "./types";

export function CameraMinus({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M19.25 11.75v5.5a2 2 0 0 1-2 2H6.75a2 2 0 0 1-2-2v-7.5a2 2 0 0 1 2-2h.333a1 1 0 0 0 .923-.615l.738-1.77a1 1 0 0 1 .923-.615h2.666M19.25 7h-4.5m.5 6a3.25 3.25 0 1 1-6.5 0 3.25 3.25 0 0 1 6.5 0Z"
      />
    </svg>
  );
}
