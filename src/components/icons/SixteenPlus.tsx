import { IconProps } from "./types";

export function SixteenPlus({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M6.25 16.25V7.75L4.75 9.25M6.25 16.25H4.75M6.25 16.25H7.25M9.75 14C9.75 12.7574 10.7606 11.75 12 11.75C13.2394 11.75 14.2383 12.7574 14.2383 14C14.2383 15.2426 13.2335 16.25 11.9941 16.25C10.7547 16.25 9.75 15.2426 9.75 14ZM9.75 14V10C9.75 8.75736 10.7606 7.75 12 7.75H12.25C13.5 7.75 14.25 8.75 14.25 8.75M18 10.75V12M18 12V13.25M18 12H19.25M18 12H16.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
