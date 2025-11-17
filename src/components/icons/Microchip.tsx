import { IconProps } from "./types";

export function Microchip({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.75 8.75v6.5a2 2 0 0 0 2 2h6.5a2 2 0 0 0 2-2v-6.5a2 2 0 0 0-2-2h-6.5a2 2 0 0 0-2 2Zm2-2.25V4.75m6.5 1.75V4.75m-6.5 14.5v-1.5m6.5 1.5v-1.5m2.25-9h1.75m-14.5 0h1.5m11.25 6.5h1.75m-14.5 0h1.5"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.75 9.75v4.5h4.5v-4.5h-4.5Z"
      />
    </svg>
  );
}
