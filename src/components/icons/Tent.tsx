import { IconProps } from "./types";

export function Tent({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.75 4.75 12 8.184m0 0 7.25 11.066H15M12 8.184 4.75 19.25H9m3-11.066 2.25-3.434M9 19.25l3-3.5 3 3.5m-6 0h6"
      />
    </svg>
  );
}
