import { IconProps } from "./types";

export function Gauge({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M16.75 17.25H17.25C18.3546 17.25 19.25 16.3546 19.25 15.25V8.75C19.25 7.64543 18.3546 6.75 17.25 6.75H6.75C5.64543 6.75 4.75 7.64543 4.75 8.75V15.25C4.75 16.3546 5.64543 17.25 6.75 17.25H7.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 19C13.1046 19 14 18.1046 14 17H12.5C12.5 17.2761 12.2761 17.5 12 17.5V19ZM14 17C14 15.8954 13.1046 15 12 15V16.5C12.2761 16.5 12.5 16.7239 12.5 17H14ZM11.5 17C11.5 16.7239 11.7239 16.5 12 16.5V15C10.8954 15 10 15.8954 10 17H11.5ZM12 17.5C11.7239 17.5 11.5 17.2761 11.5 17H10C10 18.1046 10.8954 19 12 19V17.5Z"
        fill="currentColor"
      />
      <path
        d="M11 16L8.75 11.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9.75V10.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.625 10.7213L15.375 11.1543"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
