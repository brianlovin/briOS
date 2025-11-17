import { IconProps } from "./types";

export function Cat({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12 13.75V16.25M12 16.25C10 16.25 8.75 14.75 8.75 14.75M12 16.25C14 16.25 15.25 14.75 15.25 14.75M5.65249 9.26243L4.75 4.75L8.92438 6.41975C9.85807 6.01301 10.9004 5.78571 12 5.78571C13.0996 5.78571 14.1419 6.01301 15.0756 6.41975L19.25 4.75L18.3475 9.26243C18.9226 10.2272 19.25 11.337 19.25 12.5179C19.25 16.2359 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.2359 4.75 12.5179C4.75 11.337 5.07739 10.2272 5.65249 9.26243Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 11C10.5 11.2761 10.2761 11.5 10 11.5C9.72386 11.5 9.5 11.2761 9.5 11C9.5 10.7239 9.72386 10.5 10 10.5C10.2761 10.5 10.5 10.7239 10.5 11Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 11C14.5 11.2761 14.2761 11.5 14 11.5C13.7239 11.5 13.5 11.2761 13.5 11C13.5 10.7239 13.7239 10.5 14 10.5C14.2761 10.5 14.5 10.7239 14.5 11Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
