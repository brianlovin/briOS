import { IconProps } from "./types";

export function Microscope({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12.25 5.75V10h-4.5V5.75a1 1 0 0 1 1-1h2.5a1 1 0 0 1 1 1Zm0 0h3a4 4 0 0 1 4 4v9.5H4.75l.516-.773a5 5 0 0 1 4.16-2.227h6.824v-6.5a1 1 0 0 0-1-1h-3M8.75 10v3.25h2.5V10"
      />
    </svg>
  );
}
