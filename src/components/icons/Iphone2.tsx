import { IconProps } from "./types";

export function Iphone2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.75 6.75v10.5a2 2 0 0 0 2 2h6.5a2 2 0 0 0 2-2V6.75a2 2 0 0 0-2-2h-6.5a2 2 0 0 0-2 2Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm2 2a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm-2 2a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
      />
    </svg>
  );
}
