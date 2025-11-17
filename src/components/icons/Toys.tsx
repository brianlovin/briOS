import { IconProps } from "./types";

export function Toys({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M10 15.75C10 15.75 11 16.25 12 16.25C13 16.25 14 15.75 14 15.75M9.75 10.75V13.25M7 9.25C5.75736 9.25 4.75 8.24264 4.75 7C4.75 5.75736 5.75736 4.75 7 4.75C8.24264 4.75 9.25 5.75736 9.25 7M17 9.25C18.2426 9.25 19.25 8.24264 19.25 7C19.25 5.75736 18.2426 4.75 17 4.75C15.7574 4.75 14.75 5.75736 14.75 7M14.25 10.75V13.25M18.25 13C18.25 16.4518 15.4518 19.25 12 19.25C8.54822 19.25 5.75 16.4518 5.75 13C5.75 9.54822 8.54822 6.75 12 6.75C15.4518 6.75 18.25 9.54822 18.25 13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
