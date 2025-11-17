import { IconProps } from "./types";

export function PhoneSignal({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 8.25V4.75M16.25 8.25V5.75M13.25 8.25V6.75M11.75 14.25H12.25M6.75 19.25V13.75C6.75 12.6454 7.64543 11.75 8.75 11.75H15.25C16.3546 11.75 17.25 12.6454 17.25 13.75V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
