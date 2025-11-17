import { IconProps } from "./types";

export function Paintbucket3({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <g clipPath="url(#clip0_809_74)">
        <path
          d="M15.8461 10.9988C14.9759 11.8297 12.9837 11.1857 11.3964 9.56042C9.8091 7.93511 9.22777 5.94393 10.098 5.113M15.8461 10.9988C16.7163 10.1678 16.1349 8.17665 14.5476 6.55134C12.9603 4.92603 10.9682 4.28206 10.098 5.113M15.8461 10.9988L10.9025 15.887C10.0323 16.7179 8.04015 16.074 6.45285 14.4487C4.86556 12.8234 4.28423 10.8322 5.15442 10.0012L10.098 5.113"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.25 17.6429C19.25 18.5305 18.4665 19.25 17.5 19.25C16.5335 19.25 15.75 18.5305 15.75 17.6429C15.75 16.7553 17.5 14.75 17.5 14.75C17.5 14.75 19.25 16.7553 19.25 17.6429Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_809_74">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
