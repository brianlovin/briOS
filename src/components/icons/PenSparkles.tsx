import { IconProps } from "./types";

export function PenSparkles({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M6.75 19.25L10.4174 18.3871L18.6692 10.1353C19.4436 9.3609 19.4436 8.10528 18.6692 7.33083C17.8947 6.55639 16.6391 6.55639 15.8647 7.33083L7.61293 15.5826L6.75 19.25Z"
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 7C9 7 9 4.75 9 4.75C9 4.75 9 7 11.25 7C9 7 9 9.25 9 9.25C9 9.25 9 7 6.75 7Z"
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 11C6 11 6 9.75 6 9.75C6 9.75 6 11 7.25 11C6 11 6 12.25 6 12.25C6 12.25 6 11 4.75 11Z"
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
