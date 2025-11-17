import { IconProps } from "./types";

export function Alien2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.53601 16.0616C8.01848 16.559 8.53188 17.0319 9.01987 17.524C9.74801 18.2582 10.9297 19.25 12 19.25C13.0703 19.25 14.252 18.2582 14.9801 17.524C15.4681 17.0319 15.9815 16.559 16.464 16.0616C20.266 12.1412 17.6339 4.75 12 4.75C6.36613 4.75 3.734 12.1412 7.53601 16.0616Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.25 12.25L8.75 10.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 12.25L15.25 10.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
