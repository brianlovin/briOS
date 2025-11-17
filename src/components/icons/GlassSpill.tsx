import { IconProps } from "./types";

export function GlassSpill({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11.887 14.147c1.047.489 2.689-.813 3.666-2.907.977-2.095.92-4.188-.128-4.676m-3.538 7.583c-1.048-.488-1.105-2.581-.128-4.676.977-2.094 2.618-3.396 3.666-2.907m-3.538 7.583L5.537 9.33a1.99 1.99 0 0 1-.6-2.428L5.404 5.9a1.993 1.993 0 0 1 2.247-1.1l7.774 1.764m3.825 11.325c0 .752-.56 1.361-1.25 1.361s-1.25-.61-1.25-1.361c0-.752 1.25-2.139 1.25-2.139s1.25 1.387 1.25 2.139Z"
      />
    </svg>
  );
}
