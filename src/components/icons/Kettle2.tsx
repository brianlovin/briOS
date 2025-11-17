import { IconProps } from "./types";

export function Kettle2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.75 19.25H19.25M7.75 6.7749V5.75C7.75 5.19772 8.19772 4.75 8.75 4.75H19.25L17.3983 7.75894C17.3014 7.91655 17.25 8.09798 17.25 8.28304V15.25C17.25 15.8023 16.8023 16.25 16.25 16.25H8.75C8.19772 16.25 7.75 15.8023 7.75 15.25V13.25M7.75 6.7749V13.25M7.75 6.7749H5.75C5.19772 6.7749 4.75 7.22262 4.75 7.7749V12.25C4.75 12.8023 5.19772 13.25 5.75 13.25H7.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
