import { IconProps } from "./types";

export function Shape({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 5.75V7.25C4.75 7.80228 5.19772 8.25 5.75 8.25H7.25C7.80228 8.25 8.25 7.80228 8.25 7.25V5.75C8.25 5.19771 7.80228 4.75 7.25 4.75H5.75C5.19772 4.75 4.75 5.19772 4.75 5.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 16.75V18.25C4.75 18.8023 5.19772 19.25 5.75 19.25H7.25C7.80228 19.25 8.25 18.8023 8.25 18.25V16.75C8.25 16.1977 7.80228 15.75 7.25 15.75H5.75C5.19772 15.75 4.75 16.1977 4.75 16.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 5.75V7.25C15.75 7.80228 16.1977 8.25 16.75 8.25H18.25C18.8023 8.25 19.25 7.80228 19.25 7.25V5.75C19.25 5.19771 18.8023 4.75 18.25 4.75H16.75C16.1977 4.75 15.75 5.19772 15.75 5.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 16.75V18.25C15.75 18.8023 16.1977 19.25 16.75 19.25H18.25C18.8023 19.25 19.25 18.8023 19.25 18.25V16.75C19.25 16.1977 18.8023 15.75 18.25 15.75H16.75C16.1977 15.75 15.75 16.1977 15.75 16.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 8.5V15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.25 8.5V15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 17.25H8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 6.75H8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
