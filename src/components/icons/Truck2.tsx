import { IconProps } from "./types";

export function Truck2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m17 11.25 1.864 1.45a1 1 0 0 1 .386.79v2.76a.75.75 0 0 1-.75.75h-.323M17 11.25l-.85-4.679a1 1 0 0 0-.985-.821H11.75m5.25 5.5h-3.25a2 2 0 0 1-2-2v-3.5M5.822 17H4.75V6.75a1 1 0 0 1 1-1h6m-2.518 11.5h5.536m3.41-.25a1.75 1.75 0 1 0-3.356 1.001A1.75 1.75 0 0 0 18.177 17Zm-8.928.5a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Z"
      />
    </svg>
  );
}
