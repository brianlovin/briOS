import { IconProps } from "./types";

export function Ball({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="#141414"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 19.25a7.25 7.25 0 1 0 0-14.5m0 14.5a7.25 7.25 0 1 1 0-14.5m0 14.5V4.75m-5.25 3c1.468.696 2.5 2.337 2.5 4.25 0 1.913-1.032 3.554-2.5 4.25m10.5-8.5c-1.469.696-2.5 2.337-2.5 4.25 0 1.913 1.031 3.554 2.5 4.25"
      />
    </svg>
  );
}
