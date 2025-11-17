import { IconProps } from "./types";

export function Golf({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12 14.75C7 14.75 5.41667 17.9167 4.75 19.25H19.25C18.5833 17.9167 17 14.75 12 14.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.75 16.25V9.25M11.75 9.25V4.75L17.25 7L11.75 9.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
