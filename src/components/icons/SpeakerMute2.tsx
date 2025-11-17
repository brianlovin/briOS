import { IconProps } from "./types";

export function SpeakerMute2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.5 8.75H11.5L17.25 4.75V15.5M17.25 19.25L11.5 15.25H7.75C7.19772 15.25 6.75 14.8023 6.75 14.25V11.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 17.25L4.75 6.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
