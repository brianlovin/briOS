import { IconProps } from "./types";

export function Coins({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M8.75 9.25V6.5M19.25 6.5V10.5C19.25 10.9324 18.7796 11.3281 18 11.6335M19.25 6.5C19.25 7.4665 16.8995 8.25 14 8.25C11.1005 8.25 8.75 7.4665 8.75 6.5M19.25 6.5C19.25 5.5335 16.8995 4.75 14 4.75C11.1005 4.75 8.75 5.5335 8.75 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.25 13.5V17.5C15.25 18.4665 12.8995 19.25 10 19.25C7.10051 19.25 4.75 18.4665 4.75 17.5V13.5M15.25 13.5C15.25 14.4665 12.8995 15.25 10 15.25C7.10051 15.25 4.75 14.4665 4.75 13.5M15.25 13.5C15.25 12.5335 12.8995 11.75 10 11.75C7.10051 11.75 4.75 12.5335 4.75 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
