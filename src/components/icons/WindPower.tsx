import { IconProps } from "./types";

export function WindPower({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M11 5H13L13.6675 11.0077L19.2583 14.4505L18.4148 16.2362L12.0123 14.0386L5.60986 16.2362L4.76636 14.4505L10.3307 11.024L11 5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14.5V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
