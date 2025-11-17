import { IconProps } from "./types";

export function SwissArmyKnife({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.75 17.01V17m3.5-2.5C13 7 9.75 4.75 9.75 4.75L5.9 14.135a2 2 0 0 0-.15.76V15M7 19.25h10a2.25 2.25 0 0 0 0-4.5H7a2.25 2.25 0 0 0 0 4.5Z"
      />
    </svg>
  );
}
