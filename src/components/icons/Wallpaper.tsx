import { IconProps } from "./types";

export function Wallpaper({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9.25 17C9.25 18.2426 8.24264 19.25 7 19.25C5.75736 19.25 4.75 18.2426 4.75 17C4.75 15.7574 5.75736 14.75 7 14.75C8.24264 14.75 9.25 15.7574 9.25 17Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 7C4.75 5.75736 5.75736 4.75 7 4.75C8.24264 4.75 9.25 5.75736 9.25 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 7V17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 19.25H18.25C18.8023 19.25 19.25 18.8023 19.25 18.25V7.75C19.25 7.19772 18.8023 6.75 18.25 6.75H9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 17V7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
