import { IconProps } from "./types";

export function FileImportant({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12.75 4.75H7.75C6.64543 4.75 5.75 5.64543 5.75 6.75V17.25C5.75 18.3546 6.64543 19.25 7.75 19.25H12.25M12.75 4.75L18.25 10.25H14.75C13.6454 10.25 12.75 9.35457 12.75 8.25V4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 14C18 13.4477 17.5523 13 17 13C16.4477 13 16 13.4477 16 14H18ZM16 16C16 16.5523 16.4477 17 17 17C17.5523 17 18 16.5523 18 16H16ZM16 14V16H18V14H16Z"
        fill="currentColor"
      />
      <path
        d="M18 19C18 18.4477 17.5523 18 17 18C16.4477 18 16 18.4477 16 19H18ZM16 19.01C16 19.5623 16.4477 20.01 17 20.01C17.5523 20.01 18 19.5623 18 19.01H16ZM16 19V19.01H18V19H16Z"
        fill="currentColor"
      />
    </svg>
  );
}
