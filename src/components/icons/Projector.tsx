import { IconProps } from "./types";

export function Projector({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18.25 7.75H5.75V15.25C5.75 16.3546 6.64543 17.25 7.75 17.25H16.25C17.3546 17.25 18.25 16.3546 18.25 15.25V7.75Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18.25 4.75H5.75C5.19772 4.75 4.75 5.19772 4.75 5.75V6.75C4.75 7.30228 5.19772 7.75 5.75 7.75H18.25C18.8023 7.75 19.25 7.30228 19.25 6.75V5.75C19.25 5.19772 18.8023 4.75 18.25 4.75Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 17.5V19.25"
      />
    </svg>
  );
}
