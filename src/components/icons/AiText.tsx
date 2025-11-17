import { IconProps } from "./types";

export function AiText({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 5.75H19.25M12.75 9.75H19.25M16.75 13.75H19.25M16.75 17.75H19.25M8.9999 10.75L7.78568 13.7855L4.75 14.9998L7.78561 16.214L8.99999 19.25L10.2144 16.2141L13.25 14.9998L10.2141 13.7854L8.9999 10.75Z"
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
