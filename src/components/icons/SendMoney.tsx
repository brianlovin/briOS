import { IconProps } from "./types";

export function SendMoney({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.75 10.75C7.75 9.64543 8.64543 8.75 9.75 8.75H14.25C15.3546 8.75 16.25 9.64543 16.25 10.75V17.25C16.25 18.3546 15.3546 19.25 14.25 19.25H9.75C8.64543 19.25 7.75 18.3546 7.75 17.25V10.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 10.25V6.75C19.25 5.64543 18.3546 4.75 17.25 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V10.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.25 14C13.25 14.6904 12.6904 15.25 12 15.25C11.3096 15.25 10.75 14.6904 10.75 14C10.75 13.3096 11.3096 12.75 12 12.75C12.6904 12.75 13.25 13.3096 13.25 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
