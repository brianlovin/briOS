import { IconProps } from "./types";

export function NoSmoking({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16.25 10.75v2.5m0-2.5v.5m0-.5a2 2 0 0 0-2-2h-1.5a1 1 0 0 1-1-1m-1.5 3h-1.5a1 1 0 0 0-1 1v.5a1 1 0 0 0 1 1H13M7 7l10 10m2.25-5a7.25 7.25 0 1 1-14.5 0 7.25 7.25 0 0 1 14.5 0Z"
      />
    </svg>
  );
}
