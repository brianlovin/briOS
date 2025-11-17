import { IconProps } from "./types";

export function Leaderboard({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M6.25 8.75H5.75C5.19772 8.75 4.75 9.19772 4.75 9.75V15.25C4.75 15.8023 5.19772 16.25 5.75 16.25H6.25C6.80228 16.25 7.25 15.8023 7.25 15.25V9.75C7.25 9.19772 6.80228 8.75 6.25 8.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.25 4.75H11.75C11.1977 4.75 10.75 5.19772 10.75 5.75V15.25C10.75 15.8023 11.1977 16.25 11.75 16.25H12.25C12.8023 16.25 13.25 15.8023 13.25 15.25V5.75C13.25 5.19772 12.8023 4.75 12.25 4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 19.25H19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.25 8.75H17.75C17.1977 8.75 16.75 9.19772 16.75 9.75V15.25C16.75 15.8023 17.1977 16.25 17.75 16.25H18.25C18.8023 16.25 19.25 15.8023 19.25 15.25V9.75C19.25 9.19772 18.8023 8.75 18.25 8.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
