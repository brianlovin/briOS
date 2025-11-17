import { IconProps } from "./types";

export function TrendingUp({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 11.25L10.25 5.75"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 19.2502H6.25C6.80229 19.2502 7.25 18.8025 7.25 18.2502V15.75C7.25 15.1977 6.80229 14.75 6.25 14.75H5.75C5.19772 14.75 4.75 15.1977 4.75 15.75V18.2502C4.75 18.8025 5.19772 19.2502 5.75 19.2502Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11.75 19.2502H12.25C12.8023 19.2502 13.25 18.8025 13.25 18.2502V12.75C13.25 12.1977 12.8023 11.75 12.25 11.75H11.75C11.1977 11.75 10.75 12.1977 10.75 12.75V18.2502C10.75 18.8025 11.1977 19.2502 11.75 19.2502Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M17.75 19.2502H18.25C18.8023 19.2502 19.25 18.8025 19.25 18.2502V5.75C19.25 5.19772 18.8023 4.75 18.25 4.75H17.75C17.1977 4.75 16.75 5.19772 16.75 5.75V18.2502C16.75 18.8025 17.1977 19.2502 17.75 19.2502Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11.25 8.25V4.75H7.75"
      />
    </svg>
  );
}
