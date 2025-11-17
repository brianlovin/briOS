import { IconProps } from "./types";

export function BalanceSheet({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12.75 4.75H7.75C6.64543 4.75 5.75 5.64543 5.75 6.75V10.25M12.75 4.75V8.25C12.75 9.35457 13.6454 10.25 14.75 10.25H18.25M12.75 4.75L18.25 10.25M18.25 10.25V17.25C18.25 18.3546 17.3546 19.25 16.25 19.25H12.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 12.75H8.75C7.09315 12.75 5.75 14.0931 5.75 15.75V16.25C5.75 17.9069 7.09315 19.25 8.75 19.25H9.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 16H8.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
