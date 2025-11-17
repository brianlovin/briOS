import { IconProps } from "./types";

export function FileUser({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12.75 4.75h-5a2 2 0 0 0-2 2v2.5m7-4.5v3.5a2 2 0 0 0 2 2h3.5m-5.5-5.5 5.5 5.5m-4.5 9h2.5a2 2 0 0 0 2-2v-7m-13.5 9s1.25-1.5 2.75-1.5 2.75 1.5 2.75 1.5m-2.75-4a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z"
      />
    </svg>
  );
}
