import { IconProps } from "./types";

export function DoorOpen({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M5.75 4.75L13.25 7.82143V19.25L5.75 16.1786V4.75ZM5.75 4.75L17.2557 4.81575C17.8058 4.81889 18.25 5.26568 18.25 5.81573V16.25C18.25 16.8023 17.8023 17.25 17.25 17.25H13.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
