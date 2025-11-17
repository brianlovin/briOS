import { IconProps } from "./types";

export function RailSymbol({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 9H19.25M4.75 15H19.25M9.75 4.75L14.25 9L9.75 15L14.25 19.25"
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
