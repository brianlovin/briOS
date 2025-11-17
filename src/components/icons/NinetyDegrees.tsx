import { IconProps } from "./types";

export function NinetyDegrees({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M5 12.75C8.45178 12.75 11.25 15.5482 11.25 19M4.75 4.75V19.25H19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
