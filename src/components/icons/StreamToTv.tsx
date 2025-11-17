import { IconProps } from "./types";

export function StreamToTv({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 8.25V7.75C4.75 6.64543 5.64543 5.75 6.75 5.75H17.25C18.3546 5.75 19.25 6.64543 19.25 7.75V16.25C19.25 17.3546 18.3546 18.25 17.25 18.25H14.75"
      />
      <path
        stroke="currentColor"
        d="M5.5 18C5.5 18.2761 5.27614 18.5 5 18.5C4.72386 18.5 4.5 18.2761 4.5 18C4.5 17.7239 4.72386 17.5 5 17.5C5.27614 17.5 5.5 17.7239 5.5 18Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.25 18.25C8.25 16.25 6.75 14.75 4.75 14.75"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11.25 18.25C11.25 14.5357 8.46429 11.75 4.75 11.75"
      />
    </svg>
  );
}
