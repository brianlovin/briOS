import { IconProps } from "./types";

export function Newspaper({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M17.25 19.25H5.75C5.19772 19.25 4.75 18.8023 4.75 18.25V5.75C4.75 5.19771 5.19772 4.75 5.75 4.75H14.25C14.8023 4.75 15.25 5.19772 15.25 5.75V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5227 9.75H15.25V17.25C15.25 18.3546 16.1454 19.25 17.25 19.25C18.3546 19.25 19.25 18.3546 19.25 17.25V11.4773C19.25 10.5233 18.4767 9.75 17.5227 9.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.75 8.75C7.75 8.19772 8.19772 7.75 8.75 7.75H11.25C11.8023 7.75 12.25 8.19772 12.25 8.75V10.25C12.25 10.8023 11.8023 11.25 11.25 11.25H8.75C8.19772 11.25 7.75 10.8023 7.75 10.25V8.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 13.75H12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 16.25H12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
