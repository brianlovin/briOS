import { IconProps } from "./types";

export function Rows2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 5.75012L4.75 6.25013C4.75 6.80241 5.19772 7.25013 5.75 7.25013L18.2502 7.25013C18.8025 7.25013 19.2502 6.80241 19.2502 6.25013V5.75012C19.2502 5.19784 18.8025 4.75012 18.2502 4.75012L5.75 4.75012C5.19772 4.75012 4.75 5.19784 4.75 5.75012Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 11.7501L4.75 12.2501C4.75 12.8024 5.19772 13.2501 5.75 13.2501L18.2502 13.2501C18.8025 13.2501 19.2502 12.8024 19.2502 12.2501V11.7501C19.2502 11.1978 18.8025 10.7501 18.2502 10.7501L5.75 10.7501C5.19772 10.7501 4.75 11.1978 4.75 11.7501Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 17.7501L4.75 18.2501C4.75 18.8024 5.19772 19.2501 5.75 19.2501L18.2502 19.2501C18.8025 19.2501 19.2502 18.8024 19.2502 18.2501V17.7501C19.2502 17.1978 18.8025 16.7501 18.2502 16.7501L5.75 16.7501C5.19772 16.7501 4.75 17.1978 4.75 17.7501Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
