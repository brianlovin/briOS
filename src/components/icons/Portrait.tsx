import { IconProps } from "./types";

export function Portrait({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M16.25 4.75H7.75C7.19772 4.75 6.75 5.19771 6.75 5.75V18.25C6.75 18.8023 7.19772 19.25 7.75 19.25H16.25C16.8023 19.25 17.25 18.8023 17.25 18.25V5.75C17.25 5.19772 16.8023 4.75 16.25 4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
