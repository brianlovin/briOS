import { IconProps } from "./types";

export function Dropdown({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M18.25 8.75H5.75C5.19772 8.75 4.75 9.19772 4.75 9.75V18.25C4.75 18.8023 5.19771 19.25 5.75 19.25H18.25C18.8023 19.25 19.25 18.8023 19.25 18.25V9.75C19.25 9.19772 18.8023 8.75 18.25 8.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 14H19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 5C5.5 5.27614 5.27614 5.5 5 5.5C4.72386 5.5 4.5 5.27614 4.5 5C4.5 4.72386 4.72386 4.5 5 4.5C5.27614 4.5 5.5 4.72386 5.5 5Z"
        stroke="currentColor"
      />
    </svg>
  );
}
