import { IconProps } from "./types";

export function Bath({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <g clipPath="url(#clip0_704_68)">
        <path
          d="M4.75 13.25C4.75 16.0114 6.98858 18.25 9.75 18.25H14.25C17.0114 18.25 19.25 16.0114 19.25 13.25V11.75H4.75V13.25Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 17.5L5.75 19.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.5 17.5L18.25 19.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.75 11.5V6.75C6.75 5.64543 7.64543 4.75 8.75 4.75H11.25V6.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_704_68">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
