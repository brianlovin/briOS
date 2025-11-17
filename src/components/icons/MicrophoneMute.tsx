import { IconProps } from "./types";

export function MicrophoneMute({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M15.25 8.5V8C15.25 6.20507 13.7949 4.75 12 4.75C10.2051 4.75 8.75 6.20507 8.75 8V11.1802C8.75 11.2267 8.7507 11.2721 8.75373 11.3185C8.77848 11.6975 8.95343 13.5309 10.0312 13.7969"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18.25 12.75C18.25 12.75 18 17.25 12 17.25C11.6576 17.25 11.334 17.2353 11.028 17.2077M5.75 12.75C5.75 12.75 5.85507 14.6412 7.56374 15.9716"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 17.75V19.25"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18.25 5.75L5.75 18.25"
      />
    </svg>
  );
}
