import { IconProps } from "./types";

export function Triangle({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.96873 16.3536L10.2052 5.85659C10.9418 4.38482 13.0388 4.38521 13.7748 5.85724L19.0391 16.3543C19.704 17.6842 18.7388 19.25 17.2541 19.25H6.75335C5.26832 19.25 4.30314 17.6835 4.96873 16.3536Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
