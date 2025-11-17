import { IconProps } from "./types";

export function Capricorn({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 4.75C4.75 4.75 7.75 4.65684 7.75 7V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.75 7.5C7.75 6.11929 8.5 4.75 11 4.75C13.5 4.75 14.25 6.11929 14.25 7.5V14.3889M14.25 14.3889V15L15.2987 16.4003C16.1601 17.5504 17.8753 17.5777 18.7729 16.4558C19.4447 15.616 19.4099 14.4135 18.6907 13.614L18.6147 13.5295C17.7323 12.5484 16.2122 12.4948 15.2628 13.4112L14.25 14.3889ZM14.25 14.3889L11.4124 17.128C10.6667 17.8477 9.67079 18.25 8.63439 18.25H7.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
