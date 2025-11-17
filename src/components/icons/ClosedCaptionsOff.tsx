import { IconProps } from "./types";

export function ClosedCaptionsOff({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 5.75h11.5a2 2 0 0 1 2 2v11.5L5.75 5.75Zm0 0-1-1m0 6v5.5a2 2 0 0 0 2 2h5.5m4-9.5h-.5a3 3 0 0 0-3 3v.75m2.75 2.75h.75m-5-6.5h-.5c-.446 0-.87.097-1.25.272M7.75 11.75v.5a3 3 0 0 0 3 3h.5"
      />
    </svg>
  );
}
