import { IconProps } from "./types";

export function Timer({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M18.25 13C18.25 16.4518 15.4518 19.25 12 19.25C8.54822 19.25 5.75 16.4518 5.75 13C5.75 9.54822 8.54822 6.75 12 6.75C15.4518 6.75 18.25 9.54822 18.25 13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 8.5L17.25 7.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6.5V4.75M12 4.75H9.75M12 4.75H14.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9.75V13.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
