import { IconProps } from "./types";

export function Lungs({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.25 13v3.125c0 2.5-1.07 3.125-1.792 3.125H5.75a.968.968 0 0 1-.978-1.002C5.11 10.583 9.25 6.75 9.25 6.75V13Zm0 0S12 12.75 12 4.75c0 8 2.75 8.25 2.75 8.25m0-6.25s4.14 3.833 4.478 11.498a.968.968 0 0 1-.978 1.002h-1.708c-.723 0-1.792-.625-1.792-3.125V6.75Z"
      />
    </svg>
  );
}
