import { IconProps } from "./types";

export function FolderImportant({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M18 14C18 13.4477 17.5523 13 17 13C16.4477 13 16 13.4477 16 14H18ZM16 16C16 16.5523 16.4477 17 17 17C17.5523 17 18 16.5523 18 16H16ZM16 14V16H18V14H16Z"
        fill="currentColor"
      />
      <path
        d="M18 19C18 18.4477 17.5523 18 17 18C16.4477 18 16 18.4477 16 19H18ZM16 19.01C16 19.5623 16.4477 20.01 17 20.01C17.5523 20.01 18 19.5623 18 19.01H16ZM16 19V19.01H18V19H16Z"
        fill="currentColor"
      />
      <path
        d="M13.5 7.5L12.5685 5.7923C12.2181 5.14977 11.5446 4.75 10.8127 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V11M13.25 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V7.75H17.25C18.3546 7.75 19.25 8.64543 19.25 9.75V10.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
