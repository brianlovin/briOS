import { IconProps } from "./types";

export function SafetyPin({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M5.75 7.75L14 18M18.25 17C18.25 18.2426 17.2426 19.25 16 19.25C14.7574 19.25 13.75 18.2426 13.75 17C13.75 15.7574 14.7574 14.75 16 14.75C17.2426 14.75 18.25 15.7574 18.25 17ZM18.25 17V10.25M18.25 10.25V8C18.25 6.20507 16.7949 4.75 15 4.75C13.2051 4.75 11.75 6.20507 11.75 8V10.25H13.75V8C13.75 7.30964 14.3096 6.75 15 6.75C15.6904 6.75 16.25 7.30964 16.25 8V10.25H18.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
