import { IconProps } from "./types";

export function WheelieBin({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M18 7.25L17.3672 17.3748C17.3013 18.4288 16.4272 19.25 15.3711 19.25H7M18 7.25H6M18 7.25H19.25M6 7.25H4.75M6 7.25L6.45312 14.5M7 19.25C8.24264 19.25 9.25 18.2426 9.25 17C9.25 15.7574 8.24264 14.75 7 14.75C5.75736 14.75 4.75 15.7574 4.75 17C4.75 18.2426 5.75736 19.25 7 19.25ZM6 7V4.75H17L18 7"
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
