import { IconProps } from "./types";

export function Fork({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12 10.75V19.25M12 10.75V4.75M12 10.75C13.7949 10.75 15.25 9.29493 15.25 7.5V4.75M12 10.75C10.2051 10.75 8.75 9.29493 8.75 7.5V4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
