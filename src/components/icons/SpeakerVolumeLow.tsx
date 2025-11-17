import { IconProps } from "./types";

export function SpeakerVolumeLow({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M13.25 4.75L8.5 8.75H5.75C5.19772 8.75 4.75 9.19772 4.75 9.75V14.25C4.75 14.8023 5.19772 15.25 5.75 15.25H8.5L13.25 19.25V4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.75 9.75C17.75 9.75 19.25 10.5 19.25 12C19.25 13.5 17.75 14.25 17.75 14.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
