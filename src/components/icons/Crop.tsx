import { IconProps } from "./types";

export function Crop({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 7.75H15.25C15.8023 7.75 16.25 8.19772 16.25 8.75V19.25"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 16.25H8.75C8.19772 16.25 7.75 15.8023 7.75 15.25V4.75"
      />
    </svg>
  );
}
