import { IconProps } from "./types";

export function Svg({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.25 8.75H5.75C5.19772 8.75 4.75 9.19772 4.75 9.75V11.25C4.75 11.8023 5.19772 12.25 5.75 12.25H7.25C7.80228 12.25 8.25 12.6977 8.25 13.25V14.25C8.25 14.8023 7.80228 15.25 7.25 15.25H4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 12.75H18.25C18.8023 12.75 19.25 13.1977 19.25 13.75V14.25C19.25 14.8023 18.8023 15.25 18.25 15.25H16.75C16.1977 15.25 15.75 14.8023 15.75 14.25V9.75C15.75 9.19772 16.1977 8.75 16.75 8.75H18.25C18.8023 8.75 19.25 9.19772 19.25 9.75V10.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 8.75L12 15.25L14 8.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
