import { IconProps } from "./types";

export function Gravestone({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9.75 11.75H12M14.25 11.75H12M12 11.75V9.75M12 11.75V15.25M4.75 18.25H6.75M6.75 18.25V8.75H7C8.10457 8.75 9 7.85457 9 6.75V5.75H15V6.75C15 7.85457 15.8954 8.75 17 8.75H17.25V18.25M6.75 18.25H17.25M17.25 18.25H19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
