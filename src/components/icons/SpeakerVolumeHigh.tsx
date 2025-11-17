import { IconProps } from "./types";

export function SpeakerVolumeHigh({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M15.75 10.7501C15.75 10.7501 16.25 11.2343 16.25 12C16.25 12.7657 15.75 13.2501 15.75 13.2501"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.75 7.74991C17.75 7.74991 19.25 8.99991 19.25 11.9987C19.25 14.9974 17.75 16.2499 17.75 16.2499"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.25 4.75L8.5 8.75H5.75C5.19772 8.75 4.75 9.19772 4.75 9.75V14.25C4.75 14.8023 5.19772 15.25 5.75 15.25H8.5L13.25 19.25V4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
