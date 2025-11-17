import { IconProps } from "./types";

export function Boxes({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 10.25V5.75C4.75 5.19772 5.19772 4.75 5.75 4.75H9.25C9.80228 4.75 10.25 5.19772 10.25 5.75V10.25C10.25 10.8023 9.80228 11.25 9.25 11.25H5.75C5.19772 11.25 4.75 10.8023 4.75 10.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 18.25V15.75C4.75 15.1977 5.19772 14.75 5.75 14.75H9.25C9.80228 14.75 10.25 15.1977 10.25 15.75V18.25C10.25 18.8023 9.80228 19.25 9.25 19.25H5.75C5.19772 19.25 4.75 18.8023 4.75 18.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 6.25V5.75C13.75 5.19772 14.1977 4.75 14.75 4.75H18.25C18.8023 4.75 19.25 5.19772 19.25 5.75V6.25C19.25 6.80228 18.8023 7.25 18.25 7.25H14.75C14.1977 7.25 13.75 6.80228 13.75 6.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 18.25V11.75C13.75 11.1977 14.1977 10.75 14.75 10.75H18.25C18.8023 10.75 19.25 11.1977 19.25 11.75V18.25C19.25 18.8023 18.8023 19.25 18.25 19.25H14.75C14.1977 19.25 13.75 18.8023 13.75 18.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
