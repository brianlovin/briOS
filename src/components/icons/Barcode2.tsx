import { IconProps } from "./types";

export function Barcode2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M6.75 17.5C6.33579 17.5 6 17.8358 6 18.25C6 18.6642 6.33579 19 6.75 19V17.5ZM17.25 19C17.6642 19 18 18.6642 18 18.25C18 17.8358 17.6642 17.5 17.25 17.5V19ZM6.75 19H17.25V17.5H6.75V19Z"
        fill="currentColor"
      />
      <path
        d="M4.75 5.75V13.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75 5.75V13.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 5.75V13.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 5.75V13.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
