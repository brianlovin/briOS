import { IconProps } from "./types";

export function RssFeed({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M5.5 19C5.5 19.2761 5.27614 19.5 5 19.5C4.72386 19.5 4.5 19.2761 4.5 19C4.5 18.7239 4.72386 18.5 5 18.5C5.27614 18.5 5.5 18.7239 5.5 19Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 12.75H5C8.45178 12.75 11.25 15.5482 11.25 19V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 6.75H5C11.7655 6.75 17.25 12.2345 17.25 19V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
