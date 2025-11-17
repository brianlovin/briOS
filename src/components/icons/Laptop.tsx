import { IconProps } from "./types";

export function Laptop({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M5.75 5.75C5.75 5.19772 6.19772 4.75 6.75 4.75H17.25C17.8023 4.75 18.25 5.19772 18.25 5.75V14.25H5.75V5.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.25 14.5L18.9961 18.044C19.1269 18.6655 18.6527 19.25 18.0175 19.25H5.98243C5.34725 19.25 4.87302 18.6655 5.00388 18.044L5.74998 14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
