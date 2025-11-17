import { IconProps } from "./types";

export function Seat({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M6.75 12.5L7.59247 6.47312C7.73057 5.48514 8.57562 4.75 9.57321 4.75H14.4268C15.4244 4.75 16.2694 5.48514 16.4075 6.47312L17.25 12.5M8.25 14.75L6.75 19.25M15.75 14.75L17.25 19.25M5.75 12.75C5.75 12.75 6.64286 15.25 12 15.25C17.3571 15.25 18.25 12.75 18.25 12.75H5.75Z"
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
