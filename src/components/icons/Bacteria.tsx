import { IconProps } from "./types";

export function Bacteria({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9.75 6.75L6.75 10M9.75 6.75H14.25M9.75 6.75L7.75 4.75M6.75 10V14M6.75 10L4.75 8.75M6.75 14L9.75 17.25M6.75 14L4.75 15.25M9.75 17.25H14.25M9.75 17.25L7.75 19.25M14.25 17.25L17.25 14M14.25 17.25L16.25 19.25M17.25 14V10M17.25 14L19.25 15.25M17.25 10L14.25 6.75M17.25 10L19.25 8.75M14.25 6.75L16.25 4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 12C12.75 12.6904 13.3096 13.25 14 13.25C14.6904 13.25 15.25 12.6904 15.25 12C15.25 11.3096 14.6904 10.75 14 10.75C13.3096 10.75 12.75 11.3096 12.75 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
