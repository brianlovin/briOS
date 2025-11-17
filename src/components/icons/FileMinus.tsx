import { IconProps } from "./types";

export function FileMinus({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12.25 19.25H7.75C6.64543 19.25 5.75 18.3546 5.75 17.25V6.75C5.75 5.64543 6.64543 4.75 7.75 4.75H14L18.25 9V13.25"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 17.25L15.75 17.25"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18 9.25H13.75V5"
      />
    </svg>
  );
}
