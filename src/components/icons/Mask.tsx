import { IconProps } from "./types";

export function Mask({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M10.75 12.25C10.75 12.25 11.3389 11.75 12 11.75C12.6611 11.75 13.25 12.25 13.25 12.25M7.75 9.75V13.25C7.75 13.25 7.75004 17.25 12 17.25M7.75 9.75L12 7.75L16.25 9.75M7.75 9.75H6.75C5.64543 9.75 4.75 10.6454 4.75 11.75V15.25C4.75 16.3546 5.64543 17.25 6.75 17.25H12M16.25 9.75V13.25C16.25 13.25 16.25 17.25 12 17.25M16.25 9.75H17.25C18.3546 9.75 19.25 10.6454 19.25 11.75V15.25C19.25 16.3546 18.3546 17.25 17.25 17.25H12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
