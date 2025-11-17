import { IconProps } from "./types";

export function EyeLock({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m10.25 18.078-.25-.084C6.066 16.929 4.75 12.867 4.75 12c0-1 1.75-6.25 7.25-6.25 3.067 0 4.968 1.632 6.05 3.25l.2.25M15 14.75v-1.321c0-.79.672-1.429 1.5-1.429s1.5.64 1.5 1.429v1.321m-7.607-1.175a2.25 2.25 0 0 1 3.205-3.158m.152 4.333v3.5a1 1 0 0 0 1 1h3.5a1 1 0 0 0 1-1v-3.5h-5.5Z"
      />
    </svg>
  );
}
