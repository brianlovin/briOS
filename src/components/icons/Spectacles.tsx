import { IconProps } from "./types";

export function Spectacles({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9.25 12.75H5.75C5.19772 12.75 4.75 13.1977 4.75 13.75V16.25C4.75 16.8023 5.19772 17.25 5.75 17.25H9.25C9.80228 17.25 10.25 16.8023 10.25 16.25V13.75C10.25 13.1977 9.80228 12.75 9.25 12.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.25 12.75H14.75C14.1977 12.75 13.75 13.1977 13.75 13.75V16.25C13.75 16.8023 14.1977 17.25 14.75 17.25H18.25C18.8023 17.25 19.25 16.8023 19.25 16.25V13.75C19.25 13.1977 18.8023 12.75 18.25 12.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.75 6.75L19.25 13.25V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.25 6.75L4.75 13.25V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 14.25H10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
