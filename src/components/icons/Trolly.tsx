import { IconProps } from "./types";

export function Trolly({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.75 16.25V8.75C7.75 7.64543 6.85457 6.75 5.75 6.75H4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 18.25H19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 18C9.25 18.6904 8.69036 19.25 8 19.25C7.30964 19.25 6.75 18.6904 6.75 18C6.75 17.3096 7.30964 16.75 8 16.75C8.69036 16.75 9.25 17.3096 9.25 18Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 9.75C12.75 9.19772 13.1977 8.75 13.75 8.75H18.25C18.8023 8.75 19.25 9.19772 19.25 9.75V14.25C19.25 14.8023 18.8023 15.25 18.25 15.25H13.75C13.1977 15.25 12.75 14.8023 12.75 14.25V9.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 12.25H16.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
