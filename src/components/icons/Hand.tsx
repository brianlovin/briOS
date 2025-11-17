import { IconProps } from "./types";

export function Hand({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11.25 8v3.25m0-3.25V6a1.25 1.25 0 1 1 2.5 0v5.25M11.25 8a1.25 1.25 0 0 0-2.5 0v5.25l-1.604-1.923c-.611-.733-1.728-.754-2.391-.066m0 0 1.978 4.87a5 5 0 0 0 4.633 3.119h3.884c2.21 0 3.5-1.79 3.5-4V9a1.25 1.25 0 0 0-2.5 0M4.755 11.26c-.003-.006-.005.006 0 0ZM13.75 9V7a1.25 1.25 0 1 1 2.5 0v4.25"
      />
    </svg>
  );
}
