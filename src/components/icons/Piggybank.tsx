import { IconProps } from "./types";

export function Piggybank({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 14V11C4.75 10.4477 5.19772 9.99996 5.75 9.99996H6.75C6.75 9.99996 6.75 6.74996 10 6.74996V4.74996C10 4.74996 12 4.49996 12 6.74996H15.25C17.4591 6.74996 19.25 8.54082 19.25 10.75V13.25C19.25 15.4591 17.4591 17.25 15.25 17.25H9C6.75 17.25 6.75 15 6.75 15H5.75C5.19772 15 4.75 14.5522 4.75 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 11C10.5 11.2761 10.2761 11.5 10 11.5C9.72386 11.5 9.5 11.2761 9.5 11C9.5 10.7239 9.72386 10.5 10 10.5C10.2761 10.5 10.5 10.7239 10.5 11Z"
        stroke="currentColor"
      />
      <path
        d="M8.75 17.5V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.25 17.5V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
