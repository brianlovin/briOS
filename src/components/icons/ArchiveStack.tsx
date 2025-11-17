import { IconProps } from "./types";

export function ArchiveStack({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 10.75h14.5m-12.5-3h10.5m-8.5-3h6.5m-10.5 9v3.5a2 2 0 0 0 2 2h10.5a2 2 0 0 0 2-2v-3.5h-4.5v1.5h-5.5v-1.5h-4.5Z"
      />
    </svg>
  );
}
