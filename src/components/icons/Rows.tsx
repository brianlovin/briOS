import { IconProps } from "./types";

export function Rows({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 10.2502H18.25C18.8023 10.2502 19.25 9.80253 19.25 9.25025V5.75C19.25 5.19772 18.8023 4.75 18.25 4.75H5.75C5.19772 4.75 4.75 5.19772 4.75 5.75V9.25025C4.75 9.80253 5.19772 10.2502 5.75 10.2502Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 19.2502H18.25C18.8023 19.2502 19.25 18.8025 19.25 18.2502V14.75C19.25 14.1977 18.8023 13.75 18.25 13.75H5.75C5.19772 13.75 4.75 14.1977 4.75 14.75V18.2502C4.75 18.8025 5.19772 19.2502 5.75 19.2502Z"
      />
    </svg>
  );
}
