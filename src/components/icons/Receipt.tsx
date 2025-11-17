import { IconProps } from "./types";

export function Receipt({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13.75 4.75h-8v14.5l1.599-1.243a1 1 0 0 1 1.272.036L10 19.25l1.341-1.174a1 1 0 0 1 1.318 0L14 19.25l1.379-1.207a1 1 0 0 1 1.272-.036l1.599 1.243v-9m-4.5-5.5 4.5 5.5m-4.5-5.5v3.5a2 2 0 0 0 2 2h2.5"
      />
    </svg>
  );
}
