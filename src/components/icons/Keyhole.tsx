import { IconProps } from "./types";

export function Keyhole({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12 4.75C9.65279 4.75 7.75 6.65279 7.75 9C7.75 11 9.47784 12.2305 10.25 13L6.75 19.25H17.25L13.75 13.0104C14.5222 12.2409 16.25 11 16.25 9C16.25 6.65279 14.3472 4.75 12 4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
