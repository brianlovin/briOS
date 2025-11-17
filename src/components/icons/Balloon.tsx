import { IconProps } from "./types";

export function Balloon({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12 4.75C9 4.75 5.75 8 5.75 11C5.75 14 8.25974 17.043 10.75 18L10.3999 18.4377C10.138 18.765 10.3711 19.25 10.7903 19.25H13.2097C13.6289 19.25 13.862 18.765 13.6001 18.4377L13.25 18C15.7403 17.043 18.25 14 18.25 11C18.25 8 15 4.75 12 4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
