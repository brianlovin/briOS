import { IconProps } from "./types";

export function Archive({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18.25 8.75H5.75L6.57758 17.4396C6.67534 18.4661 7.53746 19.25 8.56857 19.25H15.4314C16.4625 19.25 17.3247 18.4661 17.4224 17.4396L18.25 8.75Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 5.75C19.25 5.19772 18.8023 4.75 18.25 4.75H5.75C5.19771 4.75 4.75 5.19772 4.75 5.75V7.75C4.75 8.30228 5.19772 8.75 5.75 8.75H18.25C18.8023 8.75 19.25 8.30228 19.25 7.75V5.75Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.75 13.25H14.25"
      />
    </svg>
  );
}
