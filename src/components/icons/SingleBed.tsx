import { IconProps } from "./types";

export function SingleBed({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M8.75 17.25V18.25M15.25 17.25V18.25M16.25 11V6.75C16.25 6.19772 15.8023 5.75 15.25 5.75H8.75C8.19772 5.75 7.75 6.19772 7.75 6.75V11M14.25 10.75V9.75C14.25 9.19772 13.8023 8.75 13.25 8.75H10.75C10.1977 8.75 9.75 9.19772 9.75 9.75V10.75M15.25 10.75H8.75C7.64543 10.75 6.75 11.6454 6.75 12.75V17.25H17.25V12.75C17.25 11.6454 16.3546 10.75 15.25 10.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
