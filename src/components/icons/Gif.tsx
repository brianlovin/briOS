import { IconProps } from "./types";

export function Gif({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9.25 8.75H7.75C6.64543 8.75 5.75 9.64543 5.75 10.75V13.25C5.75 14.3546 6.64543 15.25 7.75 15.25H9.25V12.25H7.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.75 15.25V8.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.25 8.75H15.75C15.1977 8.75 14.75 9.19772 14.75 9.75V11.75M14.75 15.25V11.75M14.75 11.75H18.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
