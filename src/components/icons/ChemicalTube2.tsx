import { IconProps } from "./types";

export function ChemicalTube2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M10.5 5C10.5 4.58579 10.1642 4.25 9.75 4.25C9.33579 4.25 9 4.58579 9 5H10.5ZM15 5C15 4.58579 14.6642 4.25 14.25 4.25C13.8358 4.25 13.5 4.58579 13.5 5H15ZM9 5V17H10.5V5H9ZM15 17V5H13.5V17H15ZM12 20C13.6569 20 15 18.6569 15 17H13.5C13.5 17.8284 12.8284 18.5 12 18.5V20ZM9 17C9 18.6569 10.3431 20 12 20V18.5C11.1716 18.5 10.5 17.8284 10.5 17H9Z"
        fill="currentColor"
      />
      <path
        d="M6.75 4.75H17.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
