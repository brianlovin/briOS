import { IconProps } from "./types";

export function GenerateAi({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.25 6.75h-2.5a2 2 0 0 0-2 2v6.5a2 2 0 0 0 2 2h10.5a2 2 0 0 0 2-2v-2.5M12.75 8S16 8 16 4.75C16 8 19.25 8 19.25 8S16 8 16 11.25C16 8 12.75 8 12.75 8Z"
      />
    </svg>
  );
}
