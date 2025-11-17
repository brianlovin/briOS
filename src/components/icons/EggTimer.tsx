import { IconProps } from "./types";

export function EggTimer({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M18.25 4.75H5.75L6.85061 8.41869C7.37153 10.1551 8.58683 11.4736 10.25 12C8.58683 12.5264 7.37153 13.8449 6.85061 15.5813L5.75 19.25H18.25L17.1494 15.5813C16.6285 13.8449 15.4132 12.5264 13.75 12C15.4132 11.4736 16.6285 10.1551 17.1494 8.41869L18.25 4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
