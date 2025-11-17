import { IconProps } from "./types";

export function SquareIntersect({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12.25 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V12.25C4.75 13.3546 5.64543 14.25 6.75 14.25H12.25C13.3546 14.25 14.25 13.3546 14.25 12.25V6.75C14.25 5.64543 13.3546 4.75 12.25 4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 17.25V11.75C19.25 10.6454 18.3546 9.75 17.25 9.75H11.75C10.6454 9.75 9.75 10.6454 9.75 11.75V17.25C9.75 18.3546 10.6454 19.25 11.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
