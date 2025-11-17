import { IconProps } from "./types";

export function Router({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 14.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25V14.75C19.25 13.6454 18.3546 12.75 17.25 12.75H6.75C5.64543 12.75 4.75 13.6454 4.75 14.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 16C8.5 16.2761 8.27614 16.5 8 16.5C7.72386 16.5 7.5 16.2761 7.5 16C7.5 15.7239 7.72386 15.5 8 15.5C8.27614 15.5 8.5 15.7239 8.5 16Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 16C11.5 16.2761 11.2761 16.5 11 16.5C10.7239 16.5 10.5 16.2761 10.5 16C10.5 15.7239 10.7239 15.5 11 15.5C11.2761 15.5 11.5 15.7239 11.5 16Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12.5V10.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.7019 8.7019C10.9711 7.4327 13.0289 7.4327 14.2981 8.7019"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.58057 6.58058C10.0213 4.13981 13.9786 4.13981 16.4194 6.58058"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
