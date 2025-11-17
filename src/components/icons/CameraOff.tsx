import { IconProps } from "./types";

export function CameraOff({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.5 7.75H6.75C5.64543 7.75 4.75 8.64543 4.75 9.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H16.8358C17.7267 19.25 18.1729 18.1729 17.5429 17.5429L4.75 4.75M9.75 4.75H14.3333C14.737 4.75 15.1011 4.99274 15.2564 5.36538L15.9936 7.13462C16.1489 7.50726 16.513 7.75 16.9167 7.75H17.25C18.3546 7.75 19.25 8.64543 19.25 9.75V15.25M9.92321 10.5C9.20637 11.0962 8.75 11.9948 8.75 13C8.75 14.7949 10.2051 16.25 12 16.25C13.0052 16.25 13.9038 15.7936 14.5 15.0768"
      />
    </svg>
  );
}
