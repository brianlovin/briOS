import { IconProps } from "./types";

export function TriangleCircle({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <g clipPath="url(#clip0_809_72)">
        <path
          d="M15.7546 9.09824C17.6979 9.79164 19.1296 11.6023 19.2355 13.7911C19.3757 16.6872 17.1415 19.1486 14.2454 19.2887C12.9498 19.3514 11.7413 18.9389 10.7886 18.2046"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.75 14.25L10 4.75L15.25 14.25H4.75Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_809_72">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
