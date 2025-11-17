import { IconProps } from "./types";

export function MailOpenTick({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 11.25V8.75L12 4.75L4.75 8.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H11.25M19 9L13.25 13.25H10.75L5 9M14.75 17.75L16.25 19.25C17 17 19.25 15.75 19.25 15.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
