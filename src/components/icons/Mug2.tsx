import { IconProps } from "./types";

export function Mug2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.25 8.75H6.75C5.64543 8.75 4.75 9.64543 4.75 10.75V13.25C4.75 14.3546 5.64543 15.25 6.75 15.25H7.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 5.75H7.75V16.25C7.75 17.3546 8.64543 18.25 9.75 18.25H17.25C18.3546 18.25 19.25 17.3546 19.25 16.25V5.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
