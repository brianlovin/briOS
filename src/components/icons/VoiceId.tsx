import { IconProps } from "./types";

export function VoiceId({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M18.25 10.75V13.25M15.25 8.75V15.25M8.75 8.75V15.25M5.75 10.75V13.25M12 6.75V17.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
