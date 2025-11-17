import { IconProps } from "./types";

export function DatabaseCheck({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 7c0 1.105-3.384 2.25-7.25 2.25S4.75 8.105 4.75 7m14.5 0c0-1.105-3.384-2.25-7.25-2.25S4.75 5.895 4.75 7m14.5 0v4.25M4.75 7v10c0 1.105 3.384 2.25 7.25 2.25h.25M4.75 12c0 1.105 3.384 2.25 7.25 2.25h.25m7 .5s-1.929 2.09-2.893 4.5l-1.607-1.929"
      />
    </svg>
  );
}
