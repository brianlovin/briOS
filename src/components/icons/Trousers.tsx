import { IconProps } from "./types";

export function Trousers({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.40517 7.25H16.5517M15.3634 4.75L8.62154 4.75C8.12205 4.75 7.69916 5.11856 7.63092 5.61336L5.75 19.25L10 19.25L12 9.75L14 19.25H18L16.3562 5.63018C16.2956 5.12788 15.8694 4.75 15.3634 4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
