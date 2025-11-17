import { IconProps } from "./types";

export function Pdf({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 15.25V12.25M4.75 12.25V8.75H6.25C6.80228 8.75 7.25 9.19772 7.25 9.75V11.25C7.25 11.8023 6.80228 12.25 6.25 12.25H4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.25 8.75H9.75V15.25H11.25C12.3546 15.25 13.25 14.3546 13.25 13.25V10.75C13.25 9.64543 12.3546 8.75 11.25 8.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.25 8.75H15.75V11.75M15.75 15.25V11.75M15.75 11.75H18.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
