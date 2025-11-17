import { IconProps } from "./types";

export function MailOpenCross({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 11.25V8.75L12 4.75L4.75 8.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H11.25M15.75 15.75L17.5 17.5M17.5 17.5L19.25 19.25M17.5 17.5L19.25 15.75M17.5 17.5L15.75 19.25M19 9L13.25 13.25H10.75L5 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
