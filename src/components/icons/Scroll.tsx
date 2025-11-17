import { IconProps } from "./types";

export function Scroll({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9.75 8.75H13.25M9.75 11.75H13.25M17.625 4.75C16.7275 4.75 16.25 5.75736 16.25 7V7.25M17.625 4.75C18.5225 4.75 19.25 5.75736 19.25 7V7.25H16.25M17.625 4.75H8.75C7.64543 4.75 6.75 5.64543 6.75 6.75V16.75M16.25 7.25V17C16.25 18.2426 15.2725 19.25 14.375 19.25M14.375 19.25C13.4775 19.25 12.75 18.2426 12.75 17V16.75H6.75M14.375 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V16.75H6.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
