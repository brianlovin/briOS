import { IconProps } from "./types";

export function Tomahawk({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 4.75C19.25 4.75 18.2032 5.9199 16.2625 7.19018M16.2625 7.19018C14.2927 8.47949 11.402 9.87221 7.75 10.25C6.83333 10.5 4.75 11.4 4.75 13V16.2501C4.75 17.9069 6.09315 19.25 7.75 19.25H10.6264C12.4221 19.25 13.7714 17.6873 13.664 15.8948C13.4761 12.7566 13.7303 8.87836 16.2625 7.19018ZM16.2625 7.19018C16.2625 7.19018 16.2625 7.19019 16.2625 7.19018Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
