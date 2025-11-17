import { IconProps } from "./types";

export function TwelvehrClock({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.5 12v.25a7.25 7.25 0 1 1-9.203-6.984M14.25 8.25v-3.5h-.5m3 .926c0-.511.558-.926 1.247-.926.688 0 1.253.2 1.253.926 0 .727-2.5 2.574-2.5 2.574h2.5M12 9.75V12l2.25 2.25"
      />
    </svg>
  );
}
