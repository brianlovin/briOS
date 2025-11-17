import { IconProps } from "./types";

export function PersonWithLuggage({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14.25 14.25c0-2.75-.85-4.5-4.25-4.5s-4.25 1.75-4.25 4.5h2v3a2 2 0 0 0 2 2h2.5m2-5h-2v5m2-5h4v5h-6m0-12.25a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
      />
    </svg>
  );
}
