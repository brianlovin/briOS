import { IconProps } from "./types";

export function Vpn({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M15.75 15.25V8.75L19.25 15.25V8.75M10.75 15.25V12.25M10.75 12.25V8.75H12.25C12.8023 8.75 13.25 9.19772 13.25 9.75V11.25C13.25 11.8023 12.8023 12.25 12.25 12.25H10.75ZM4.75 8.75L6.5 15.25L8.25 8.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
