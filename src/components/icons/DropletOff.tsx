import { IconProps } from "./types";

export function DropletOff({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.298 12c-.337.781-.548 1.498-.548 2.071 0 2.86 2.35 5.179 5.25 5.179a5.29 5.29 0 0 0 2-.389m2.638-2.361a5.1 5.1 0 0 0 .612-2.429c0-2.86-5.25-9.321-5.25-9.321s-1.575 1.939-3 4.162M4.75 4.75l14.5 14.5"
      />
    </svg>
  );
}
