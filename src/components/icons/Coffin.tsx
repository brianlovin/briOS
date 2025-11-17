import { IconProps } from "./types";

export function Coffin({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M10.75 9.75H12M13.25 9.75H12M12 9.75V8.75M12 9.75V12.25M9.75 19.25H14.25L17.25 9L14.9375 4.75H9L6.75 9L9.75 19.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
