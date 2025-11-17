import { IconProps } from "./types";

export function SpacingHorizontal({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 4.75H6.25C7.35457 4.75 8.25 5.64543 8.25 6.75V17.25C8.25 18.3546 7.35457 19.25 6.25 19.25H4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 4.75H17.75C16.6454 4.75 15.75 5.64543 15.75 6.75V17.25C15.75 18.3546 16.6454 19.25 17.75 19.25H19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8.75V15.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
