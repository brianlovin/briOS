import { IconProps } from "./types";

export function Gbp({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M17.25 8.25V6.75C17.25 5.64543 16.3546 4.75 15.25 4.75H11.75C10.6454 4.75 9.75 5.64338 9.75 6.74795V14C9.75 17 6.75 19.25 6.75 19.25H15.25C16.3546 19.25 17.25 18.3546 17.25 17.25V16.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 11.75H13.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
