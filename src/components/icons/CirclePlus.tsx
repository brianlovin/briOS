import { IconProps } from "./types";

export function CirclePlus({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12.25 4.75H12A7.25 7.25 0 1 0 19.25 12v-.25m-2.25-7V7m0 0v2.25M17 7h2.25M17 7h-2.25"
      />
    </svg>
  );
}
