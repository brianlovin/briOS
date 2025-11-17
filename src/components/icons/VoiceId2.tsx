import { IconProps } from "./types";

export function VoiceId2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18.25 10.75v2.5m-3-4.5v6.5m-6.5-6.5v6.5m-3-4.5v2.5M12 6.75v10.5m-7.25-10v-.5a2 2 0 0 1 2-2h.5m12 2.5v-.5a2 2 0 0 0-2-2h-.5m-12 12v.5a2 2 0 0 0 2 2h.5m12-2.5v.5a2 2 0 0 1-2 2h-.5"
      />
    </svg>
  );
}
