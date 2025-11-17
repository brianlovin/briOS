import { IconProps } from "./types";

export function FountainPen({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 16C4.75 14.2051 6.20507 12.75 8 12.75C9.79493 12.75 11.25 14.2051 11.25 16C11.25 17.7949 9.79493 19.25 8 19.25H4.75V16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 16.25C11.9363 16.25 12.8262 15.842 13.4372 15.1325L18.712 9.008C19.5121 7.95074 19.4097 6.46534 18.4722 5.52781C17.5347 4.59028 16.0493 4.48793 14.992 5.28802L8.86747 10.5628C8.158 11.1738 7.75 12.0637 7.75 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 19L7.25 16.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
